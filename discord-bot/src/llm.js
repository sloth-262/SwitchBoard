const {
    formatStatus,
    formatRoom,
    formatUsage,
    formatAlert
  } = require("./formatter");
  
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GROQ_MODEL = process.env.GROQ_MODEL;
  
  function getFallback(intent, data, extra = {}) {
    if (intent === "status") return formatStatus(data);
    if (intent === "room") return formatRoom(data);
    if (intent === "usage") return formatUsage(data);
  
    if (intent === "alert") {
      if (typeof formatAlert === "function") return formatAlert(data);
  
      return `Alert: ${data.device || "Unknown device"} in ${data.room || "Unknown room"} — ${data.reason || "Alert triggered"}.`;
    }
  
    return "Monitoring data is available, but I could not format it properly.";
  }
  
  function buildPrompt(intent, data, extra = {}) {
    return `
  You are a Discord assistant for an office IoT monitoring system.
  
  Your task:
  Convert backend JSON into a short, helpful Discord message.
  
  Rules:
  - Use only the JSON data given.
  - Do not invent device states, rooms, wattage, usage, or alerts.
  - Do not output JSON.
  - Keep the answer under 3 sentences.
  - Sound like a helpful office colleague.
  - If there is an alert, mention it clearly.
  - Do not say "according to the JSON".
  - Do not mention that you are an AI model.
  
  Intent: ${intent}
  Room name if relevant: ${extra.roomName || "N/A"}
  
  Backend JSON:
  ${JSON.stringify(data, null, 2)}
  `;
  }
  
  async function humanize(intent, data, extra = {}) {
    if (!GROQ_API_KEY || !GROQ_MODEL) {
      return getFallback(intent, data, extra);
    }
  
    const prompt = buildPrompt(intent, data, extra);
  
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: "You rewrite IoT monitoring data into concise Discord messages. You never invent data."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 180
        })
      });
  
      if (!response.ok) {
        console.warn("LLM failed. Using fallback formatter.");
        return getFallback(intent, data, extra);
      }
  
      const result = await response.json();
      const text = result.choices?.[0]?.message?.content?.trim();
  
      if (!text) {
        return getFallback(intent, data, extra);
      }
  
      return text;
    } catch (error) {
      console.warn("LLM error:", error.message);
      return getFallback(intent, data, extra);
    }
  }
  
  module.exports = {
    humanize
  };