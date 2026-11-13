import createTaskAgent from "../agents/taskAgent.js";

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    // Create an agent for the authenticated user.
    const toolCalls = [];

    const agent = createTaskAgent(req.session.userId, toolCalls);

    // Send the user's message to the agent.
    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: message.trim(),
        },
      ],
    });

    // Get the agent's final response.
    const lastMessage = result.messages[result.messages.length - 1];
    const reply = Array.isArray(lastMessage.content)
      ? lastMessage.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("")
      : lastMessage.content;

    return res.status(200).json({
      reply,
      toolCalls,
    });
  } catch (error) {
    console.error("Chat agent error:", error);

    return res.status(500).json({
      message: "Failed to process your request.",
    });
  }
};

export { chat };
