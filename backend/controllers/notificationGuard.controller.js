/**
 * notificationGuard.controller.js
 *
 * Analyzes abusive notification permission requests.
 * Backend-only (Postman testable).
 * Uses rules for severity + AI only for explanation polish.
 */

import dotenv from "dotenv";
dotenv.config();

import * as cheerio from "cheerio";

// ================== HARD-CODED TARGET ==================
const TARGET_URL = "https://www.cardekho.com/";

// ================== CONFIG ==================
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ================== HELPERS ==================
const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n)));

// ================== RULE-BASED ANALYSIS ==================
function analyzeNotificationBehavior(html) {
  const h = html.toLowerCase();

  const signals = {
    callsRequestPermission: h.includes("notification.requestpermission"),
    manipulativeCopy: [
      "click allow",
      "enable notifications",
      "allow notifications",
      "turn on notifications",
      "stay updated"
    ].filter(k => h.includes(k)),
    autoTrigger: h.includes("settimeout") && h.includes("requestpermission")
  };

  let score = 0;

  if (signals.callsRequestPermission) score += 50;
  if (signals.manipulativeCopy.length > 0) score += 30;
  if (signals.autoTrigger) score += 20;

  let severity = "low";
  let shouldBlock = false;

  if (score >= 70) {
    severity = "high";
    shouldBlock = true;
  } else if (score >= 40) {
    severity = "medium";
  }

  return {
    should_block: shouldBlock,
    severity,
    confidence: clamp(score),
    signals_detected: [
      signals.callsRequestPermission && "notification.requestPermission() detected",
      signals.manipulativeCopy.length > 0 && "manipulative notification copy detected",
      signals.autoTrigger && "auto-triggered permission request detected"
    ].filter(Boolean)
  };
}

// ================== AI EXPLANATION (OPTIONAL, CONTROLLED) ==================
async function generateExplanation(analysis) {
  if (!GROQ_API_KEY) {
    return analysis.should_block
      ? "Aggressive notification permission behavior detected."
      : "No abusive notification behavior detected.";
  }

  const prompt = `
Explain in one short sentence why this notification request behavior is ${
analysis.should_block ? "abusive" : "not abusive"
}.

Severity: ${analysis.severity}
Signals:
${analysis.signals_detected.join(", ") || "none"}
`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 60
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim()
      || "Notification behavior analyzed.";

  } catch {
    return "Notification behavior analyzed.";
  }
}

// ================== CONTROLLER ==================
export const notificationGuard = async (req, res) => {
  try {
    const pageRes = await fetch(TARGET_URL);
    const html = await pageRes.text();

    const analysis = analyzeNotificationBehavior(html);
    const reason = await generateExplanation(analysis);

    res.json({
      url: TARGET_URL,
      notification_request_guard: {
        should_block: analysis.should_block,
        severity: analysis.severity,
        confidence: analysis.confidence,
        reason,
        signals_detected: analysis.signals_detected
      }
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || "Notification guard analysis failed"
    });
  }
};
