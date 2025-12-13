/**
 * privacyPolicy.controller.js
 *
 * Analyzes a website's privacy policy ONLY if a privacy/cookie popup exists.
 * Uses:
 *  - Static popup detection
 *  - Policy link discovery
 *  - Text extraction + reduction
 *  - Groq LLM scoring
 *
 * URL is HARD-CODED for now (same pattern as cookie consent).
 */

import dotenv from "dotenv";
dotenv.config();

import * as cheerio from "cheerio";
import { htmlToText } from "html-to-text";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ================== HARD-CODED TARGET ==================
const TARGET_URL = "https://www.thehindu.com/";

// ================== CONFIG ==================
const CACHE_DIR = path.join(process.cwd(), "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ================== HELPERS ==================
const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

// ================== POPUP DETECTION ==================
function hasPrivacyConsentPopup(html) {
  if (!html) return false;
  const h = html.toLowerCase();

  const CMP_KEYWORDS = [
    "onetrust",
    "cookiebot",
    "quantcast",
    "didomi",
    "trustarc",
    "consentmanager",
    "iubenda",
    "__tcfapi",
    "ot-sdk-container",
    "cmpbox",
    "cc-window"
  ];

  const CONSENT_TEXTS = [
    "accept cookies",
    "accept all",
    "reject all",
    "manage preferences",
    "cookie settings",
    "privacy settings",
    "we use cookies",
    "your privacy choices"
  ];

  return (
    CMP_KEYWORDS.some(k => h.includes(k)) ||
    CONSENT_TEXTS.some(t => h.includes(t))
  );
}

// ================== FIND POLICY LINK ==================
async function findPolicyLink(siteUrl) {
  try {
    const res = await fetch(siteUrl);
    const html = await res.text();
    const $ = cheerio.load(html);

    const patterns = ["privacy", "privacy-policy", "privacypolicy", "cookie", "gdpr"];

    const links = $("a[href]").toArray().map(el => ({
      href: $(el).attr("href") || "",
      text: ($(el).text() || "").toLowerCase()
    }));

    for (const p of patterns) {
      const match = links.find(l => l.href.toLowerCase().includes(p));
      if (match) return new URL(match.href, siteUrl).href;
    }

    for (const p of patterns) {
      const match = links.find(l => l.text.includes(p));
      if (match) return new URL(match.href, siteUrl).href;
    }

    return null;
  } catch {
    return null;
  }
}

// ================== FETCH + CLEAN TEXT ==================
async function fetchAndExtractText(url) {
  const res = await fetch(url);
  const html = await res.text();

  return htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: "script", format: "skip" },
      { selector: "style", format: "skip" }
    ]
  })
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// ================== TEXT REDUCTION ==================
function makeExcerpt(text, limit = 3000) {
  if (!text || text.length < 200) {
    return text || "No privacy policy text found.";
  }

  const keywords = [
    "personal",
    "data",
    "share",
    "sell",
    "third",
    "cookie",
    "track",
    "retain",
    "delete",
    "gdpr",
    "ccpa",
    "consent"
  ];

  const sentences = text.split(/(?<=\.)\s+/);
  const picked = sentences.filter(s =>
    keywords.some(k => s.toLowerCase().includes(k))
  );

  const finalText =
    picked.length > 0
      ? picked.join(" ")
      : sentences.slice(0, 10).join(" ");

  return finalText.length > limit
    ? finalText.slice(0, limit)
    : finalText;
}

// ================== CACHE ==================
const cachePath = (domain) => path.join(CACHE_DIR, `${domain}.json`);

const loadCache = (domain) => {
  try {
    return JSON.parse(fs.readFileSync(cachePath(domain), "utf8"));
  } catch {
    return null;
  }
};

const saveCache = (domain, data) => {
  fs.writeFileSync(cachePath(domain), JSON.stringify(data, null, 2));
};

// ================== GROQ CALL ==================
async function callGroq(excerpt) {
  const prompt = `
Analyze this privacy policy excerpt.

Return ONLY valid JSON:
{
  "score": number (0-100),
  "message": "one short sentence"
}

Privacy policy excerpt:
${excerpt}
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
    return { score: 40, message: "Unclear privacy practices." };
  }

  const parsed = JSON.parse(match[0]);
  return {
    score: clamp(parsed.score ?? 40),
    message: String(parsed.message || "").slice(0, 300)
  };
}

// ================== CONTROLLER ==================
export const analyzePrivacyPolicy = async (req, res) => {
  try {
    const url = TARGET_URL;
    const domain = new URL(url).hostname.replace(/\./g, "_");

    const cached = loadCache(domain);
    if (cached && Date.now() - cached.timestamp < 30 * 86400000) {
      return res.json({ url, ...cached });
    }

    const homepageHtml = await (await fetch(url)).text();

    if (!hasPrivacyConsentPopup(homepageHtml)) {
      return res.json({
        url,
        reputation_score: "N/A",
        reputation_level: "no-consent-popup",
        message: "No privacy or cookie consent popup detected."
      });
    }

    const policyLink = await findPolicyLink(url);
    const text = await fetchAndExtractText(policyLink || url);
    const excerpt = makeExcerpt(text);
    const result = await callGroq(excerpt);

    const level =
      result.score >= 75 ? "safe" :
      result.score >= 50 ? "caution" :
      "danger";

    const payload = {
      reputation_score: result.score,
      reputation_level: level,
      message: result.message,
      timestamp: Date.now()
    };

    saveCache(domain, payload);
    res.json({ url, ...payload });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
