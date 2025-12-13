

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// TEMP: hardcoded for testing
const TARGET_URL =
  "https://www.thehindu.com/";

export const analyzeCookieConsent = async (req, res) => {
  try {
    const prompt = `
Analyze the cookie consent behavior of this website:
${TARGET_URL}

Return ONLY valid JSON:
{
  "isManipulative": true or false,
  "severity": "low" | "medium" | "high",
  "confidence": number,
  "reason": "short explanation"
}
`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    const data = await aiRes.json();
    const raw = data?.choices?.[0]?.message?.content || "";

    const match = raw.match(/\{[\s\S]*\}/);

    res.json(
      match
        ? { url: TARGET_URL, ...JSON.parse(match[0]) }
        : {
            url: TARGET_URL,
            isManipulative: false,
            severity: "low",
            confidence: 0.3,
            reason: "No clear manipulation detected",
          }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cookie analysis failed" });
  }
};
