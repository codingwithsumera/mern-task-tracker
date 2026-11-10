import OpenAI from "openai";

const generateReply = async (message) => {
  const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    timeout: 30000,
    maxRetries: 0,
  });

  const response = await client.chat.completions.create({
    model: "gemini-3.5-flash-lite",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message.content;
};

export default generateReply;
