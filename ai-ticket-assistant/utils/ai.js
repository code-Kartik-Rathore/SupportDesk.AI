import Groq from "groq-sdk";

const analyzeTicket = async (ticket) => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY is missing. Skipping AI analysis and falling back to defaults.");
    return null;
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const systemPrompt = `You are an expert AI assistant that processes technical support tickets.
Your job is to:
1. Summarize the issue.
2. Estimate its priority (low, medium, high).
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond ONLY with valid raw JSON.
- Do NOT include markdown, code fences, comments, or extra formatting.`;

  const userPrompt = `
Analyze this support ticket and return ONLY a JSON object exactly matching this structure:

{
  "summary": "Short summary of the ticket",
  "priority": "high",
  "helpfulNotes": "Here are useful tips...",
  "relatedSkills": ["React", "Node.js"]
}

Ticket:
- Title: ${ticket.title}
- Description: ${ticket.description}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices[0]?.message?.content || "";
    console.log("Raw AI response:", raw);

    if (!raw) {
      console.warn("⚠️ AI returned empty response");
      return null;
    }

    // Strip code fences just in case, though response_format should prevent them
    const cleaned = raw.replace(/```json\s*|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse JSON from AI response:", err.message);
    return null;
  }
};

export default analyzeTicket;
