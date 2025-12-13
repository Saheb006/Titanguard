/**
 * trackerDetect.controller.js
 *
 * Detects and classifies trackers on a HARD-CODED URL.
 * Designed for backend-only Postman testing.
 * Uses AI (Groq) for classification.
 */

//NOT COMPPLETE CUZ BLOCKER CAN ONLY WORK ON BROWSER

import dotenv from "dotenv";
dotenv.config();

import * as cheerio from "cheerio";

// ================== HARD-CODED TARGET ==================
const TARGET_URL = "https://www.cricbuzz.com";

// ================== CONFIG ==================
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ================== HELPERS ==================
const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n)));

// ================== AI CLASSIFIER ==================
async function classifyTracker(resourceUrl) {
  const prompt = `
You are a privacy and cybersecurity AI.

Analyze the following web resource URL and decide if it is a tracking resource.

Return ONLY valid JSON:
{
  "isTracker": true or false,
  "isHarmful": true or false,
  "category": "analytics" | "advertising" | "fingerprinting" | "functional",
  "confidence": number (0-100)
}

Resource URL:
${resourceUrl}
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
        max_tokens: 200
      })
    });

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content || "";
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      return {
        isTracker: false,
        isHarmful: false,
        category: "unknown",
        confidence: 0
      };
    }

    const parsed = JSON.parse(match[0]);

    return {
      isTracker: Boolean(parsed.isTracker),
      isHarmful: Boolean(parsed.isHarmful),
      category: parsed.category || "unknown",
      confidence: clamp(parsed.confidence ?? 0)
    };

  } catch {
    return {
      isTracker: false,
      isHarmful: false,
      category: "unknown",
      confidence: 0
    };
  }
}

// ================== CONTROLLER ==================
export const detectTrackers = async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: "Server misconfigured: GROQ_API_KEY missing"
      });
    }

    const pageRes = await fetch(TARGET_URL);
    const html = await pageRes.text();
    const $ = cheerio.load(html);

    // Collect resources
    const resources = new Set();

    $("script[src]").each((_, el) => resources.add($(el).attr("src")));
    $("img[src]").each((_, el) => resources.add($(el).attr("src")));
    $("iframe[src]").each((_, el) => resources.add($(el).attr("src")));

    if (resources.size === 0) {
      return res.json({
        url: TARGET_URL,
        trackers: [],
        message: "unable to detect trackers",
        harmful_tracker: 0
      });
    }

    const resourceList = [...resources].slice(0, 15);
    const results = [];

    for (const r of resourceList) {
      if (!r) continue;

      const absoluteUrl = r.startsWith("http")
        ? r
        : new URL(r, TARGET_URL).href;

      const aiResult = await classifyTracker(absoluteUrl);

      results.push({
        resource: absoluteUrl,
        ...aiResult
      });
    }

    // 🔢 COUNTS
    const totalTrackers = results.filter(r => r.isTracker).length;
    const harmfulTrackers = results.filter(
      r => r.isTracker && r.isHarmful
    ).length;

    res.json({
      url: TARGET_URL,
      total_resources_checked: results.length,
      total_trackers_detected: totalTrackers,
      message:
        totalTrackers === 0
          ? "unable to detect trackers"
          : `${totalTrackers} potential trackers detected`,
      harmful_tracker: harmfulTrackers,
      trackers: results
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || "Tracker detection failed"
    });
  }
};

