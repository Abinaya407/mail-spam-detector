"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function ResultContent() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
const percentage = Number(searchParams.get("percentage") || 0);  console.log("STATUS:", status);
console.log("PERCENTAGE:", percentage);
  const senderEmail = searchParams.get("senderEmail");
  const risksParam = searchParams.get("risks");
  const urlsParam = searchParams.get("urls");

  const risks =
    risksParam && risksParam !== "undefined"
      ? JSON.parse(decodeURIComponent(risksParam))
      : [];

  const urls =
    urlsParam && urlsParam !== "undefined"
      ? JSON.parse(decodeURIComponent(urlsParam))
      : [];

  const isSpam = status?.toLowerCase().trim() === "spam";

  const reasons = isSpam
    ? [
        "Suspicious promotional wording",
        "Urgency-related phrases detected",
        "Contains spam keywords",
      ]
    : [
        "No suspicious wording found",
        "Content appears safe",
      ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#d1d5db",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >

      <h1
        style={{
          fontSize: "48px",
          marginBottom: "20px",
          color: isSpam ? "red" : "green",
        }}
      >
        {isSpam ? "⚠️ Spam Detected" : "✅ Safe Email"}
      </h1>

      <h2
        style={{
          marginBottom: "25px",
          color: "#111827",
        }}
      >
        Spam Probability: {percentage}%
      </h2>

      <div
        style={{
          width: "400px",
          height: "20px",
          backgroundColor: "#9ca3af",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: isSpam ? "red" : "green",
          }}
        ></div>
      </div>

      {/* Reasons Box */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          width: "500px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            marginBottom: "15px",
            fontSize: "24px",
          }}
        >
          Reasons
        </h3>

        <ul>
          {reasons.map((reason, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                fontSize: "18px",
              }}
            >
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Warnings */}
      {risks.length > 0 && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            padding: "20px",
            borderRadius: "12px",
            width: "500px",
            marginBottom: "20px",
          }}
        >
          {senderEmail && (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      width: "500px",
      marginBottom: "20px",
    }}
  >
    <h3
      style={{
        marginBottom: "15px",
        fontSize: "22px",
      }}
    >
      📧 Sender Analysis
    </h3>

    <p>
      <strong>Sender:</strong> {senderEmail}
    </p>
  </div>
)}
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "22px",
              color: "red",
            }}
          >
            ⚠️ Risk Warnings
          </h3>

          <ul>
            {risks.map((risk: string, index: number) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  fontSize: "18px",
                }}
              >
                • {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detected Links */}
      {urls.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "500px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "22px",
            }}
          >
            🔗 Detected Links
          </h3>

          <ul>
            {urls.map((url: string, index: number) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  wordBreak: "break-all",
                  color: "blue",
                }}
              >
                {url}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: "20px",
          padding: "14px 30px",
          backgroundColor: "#111827",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Analyze Another Email
      </button>

    </div>
  );
}
export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}