"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  
  const detectSpam = async () => {

    const response = await fetch("https://mail-spam-detector-2i1b.onrender.com/detect", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
          senderEmail,

      }),
    });

    const data = await response.json();

    console.log(data);

    router.push(
 `/result?status=${data.status}
  &percentage=${data.percentage}
  &senderEmail=${encodeURIComponent(data.senderEmail || "")}
  &risks=${encodeURIComponent(JSON.stringify(data.risks || []))}
  &urls=${encodeURIComponent(JSON.stringify(data.urls || []))}`
);    
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#d1d5db",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Spam Detector
      </h1>

      <p
        style={{
          color: "#374151",
          marginBottom: "25px",
          fontSize: "18px",
        }}
      >
        Paste your email content or enter an email ID
      </p>
        <input
  type="email"
  placeholder="Sender Email"
  value={senderEmail}
  onChange={(e) => setSenderEmail(e.target.value)}
   style={{
    width: "600px",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #9ca3af",
    fontSize: "16px",
  }}
/>
      <textarea
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Paste email here..."
        style={{
          width: "600px",
          height: "220px",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #9ca3af",
          fontSize: "16px",
          resize: "none",
          outline: "none",
        }}
      />

      <button
        onClick={detectSpam}
        style={{
          marginTop: "25px",
          padding: "14px 40px",
          backgroundColor: "#111827",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Detect Spam
      </button>

    </div>
  );
}