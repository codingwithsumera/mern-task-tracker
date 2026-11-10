import generateReply from "../services/llm.js";

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    const reply = await generateReply(message.trim());

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      message: "Failed to generate a response.",
    });
  }
};

export { chat };
