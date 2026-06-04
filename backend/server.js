  require("dotenv").config();
const { exec } = require("child_process");
const Email = require("./models/Email");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch((error) => console.log(error));
app.post("/detect", async (req, res) => {

  const email = req.body.email;
const senderEmail = req.body.senderEmail || "";
const urlRegex = /(https?:\/\/[^\s]+)/g;
const urls = email.match(urlRegex) || [];  let risks = [];
  if (urls.length > 0) {
  risks.push("Contains clickable links");
}


const cleanedEmail = email + " " + (urls.join(" ") || "");

  exec(`python ml/predict.py "${cleanedEmail}"`, async (error, stdout) => {

    if (error) {
      console.log(error);
      return res.json({
        status: "error",
        percentage: 0,
        risks,
        urls,
      });
    }
    const result = JSON.parse(stdout);
    const percentage = result.percentage;
    console.log("ML SCORE:", percentage);
    let urlRiskScore = 0;
    const suspiciousExtensions = [
  ".xyz",
  ".click",
  ".top",
  ".tk"
];

suspiciousExtensions.forEach(ext => {
  if (senderEmail.toLowerCase().includes(ext)) {
    risks.push("Suspicious sender domain");
    urlRiskScore += 10;
  }
});

let status = result.status;

const phishingKeywords = [
  "login",
  "verify",
  "secure",
  "account",
  "bank",
  "update",
  "password"
];

urls.forEach((url) => {
  const lowerUrl = url.toLowerCase();

  phishingKeywords.forEach((word) => {
    if (lowerUrl.includes(word)) {
      risks.push(`Suspicious keyword in URL: ${word}`);
      urlRiskScore += 3;
    }
  });

  if (url.includes(".xyz") || url.includes(".top") || url.includes(".click")) {
    risks.push("Suspicious domain extension detected");
    urlRiskScore += 15;
  }
});
const freeProviders = [
  "@gmail.com",
  "@yahoo.com",
  "@outlook.com"
];

freeProviders.forEach(provider => {
  if (senderEmail.toLowerCase().includes(provider)) {
    risks.push("Uses free email provider");
    urlRiskScore += 5;
  }
});
const companyNames = [
  "paypal",
  "amazon",
  "bank",
  "google"
];

companyNames.forEach(company => {

  if (
    senderEmail.toLowerCase().includes(company) &&
    !senderEmail.toLowerCase().endsWith(`${company}.com`)
  ) {

    risks.push(
      `Possible spoofing attempt (${company})`
    );urlRiskScore += 30;

  }

});
let finalPercentage = percentage;

finalPercentage += urlRiskScore;
finalPercentage = Math.min(100, finalPercentage);
if (finalPercentage >= 40 ||
  risks.includes("Suspicious domain extension detected") ||
  risks.some(risk => risk.includes("Possible spoofing attempt"))
) {
  status = "spam";
}

if (finalPercentage > 100) {
  finalPercentage = 100;
}
    const newEmail = new Email({
      email,
      senderEmail,
      status,
      percentage: finalPercentage,
    });

    await newEmail.save();
    console.log("FINAL RESPONSE");
   console.log({
  status,
  percentage: finalPercentage,
  urls,
  risks,
});
    res.json({
      status,
      percentage: finalPercentage,
      urls,
      risks,
        senderEmail,

    });

  });

});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});