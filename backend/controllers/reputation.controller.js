/**
 * reputation.controller.js
 *
 * AI-based website reputation analysis using urlscan + Groq LLM
 * URL is HARD-CODED for now (same pattern as cookie + privacy analyzers)
 */

import dotenv from "dotenv";
dotenv.config();

// ================== HARD-CODED TARGET ==================
const TARGET_URL = "https://www.thehindu.com/"; // change when needed

const URLSCAN_API_KEY = process.env.VITE_URLSCAN_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

// ================== URLSCAN HELPERS ==================

async function submitScan(url) {
  const res = await fetch("https://urlscan.io/api/v1/scan/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": URLSCAN_API_KEY
    },
    body: JSON.stringify({ url, visibility: "private" })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`urlscan submit failed: ${t}`);
  }

  return res.json();
}

async function fetchResult(uuid) {
  const res = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("urlscan result fetch failed");
  return res.json();
}

// ================== SIGNAL EXTRACTION ==================

function extractSignals(result) {
  return {
    domainAgeDays: result?.page?.domainAgeDays ?? null,
    verdicts: result?.verdicts ?? {},
    trackers: (result?.requests || [])
      .map(r => r?.request?.url || "")
      .filter(u =>
        /analytics|doubleclick|facebook|googletagmanager|adsystem/i.test(u)
      )
      .slice(0, 15),
    scriptRatio: (() => {
      const stats = result?.stats?.resourceStats;
      if (!stats) return null;
      const scripts = stats.script || 0;
      const total = Object.values(stats).reduce((a, b) => a + b, 0);
      return total ? Math.round((scripts / total) * 100) : null;
    })(),
    securityHeaders: (result?.securityHeaders || []).map(h => h.name),
    hostingASN: result?.page?.asnname || "",
    redirects: result?.stats?.redirects ?? 0
  };
}

// ================== AI SCORING ==================

async function scoreWithAI(url, signals) {
  const prompt = `
You are a cybersecurity reputation analysis AI.

Based on the technical signals below, determine how trustworthy the website is.

Return ONLY valid JSON:
{
  "reputation_score": number (0-100),
  "reputation_level": "safe" | "caution" | "danger",
  "message": "short explanation understandable to normal users"
}

Website:
${url}

Signals:
${JSON.stringify(signals, null, 2)}
`;

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
      max_tokens: 300
    })
  });

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content || "";
  const match = raw.match(/\{[\s\S]*\}/);

  if (!match) {
    return {
      reputation_score: 50,
      reputation_level: "caution",
      message: "Insufficient signals to confidently assess website safety."
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return {
      reputation_score: 50,
      reputation_level: "caution",
      message: "AI response could not be interpreted reliably."
    };
  }

  const score = clamp(Number(parsed.reputation_score ?? 50));
  const level =
    score >= 75 ? "safe" :
    score >= 50 ? "caution" :
    "danger";

  return {
    reputation_score: score,
    reputation_level: level,
    message: String(parsed.message || "").slice(0, 300)
  };
}

// ================== CONTROLLER ==================

export const analyzeReputation = async (req, res) => {
  try {
    if (!URLSCAN_API_KEY || !GROQ_API_KEY) {
      return res.status(500).json({
        error: "Server misconfigured: missing API keys"
      });
    }

    const url = TARGET_URL;

    // 1. Submit scan
    const submit = await submitScan(url);
    const uuid = submit.uuid;
    if (!uuid) throw new Error("urlscan UUID missing");

    // 2. Poll for result
    let result = null;
    const start = Date.now();
    while (Date.now() - start < 120000) {
      result = await fetchResult(uuid);
      if (result) break;
      await sleep(3000);
    }

    if (!result) {
      return res.status(504).json({
        url,
        reputation_score: "N/A",
        reputation_level: "unknown",
        message: "Timed out waiting for scan result"
      });
    }

    // 3. Extract signals
    const signals = extractSignals(result);

    // 4. AI scoring
    const aiResult = await scoreWithAI(url, signals);

    res.json({
      url,
      ...aiResult
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || "Reputation analysis failed"
    });
  }
};


