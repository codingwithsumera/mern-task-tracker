import { useState } from "react";
import { sendMessage } from "../services/chatService";
import { useChat } from "../context/ChatContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setInput("");
    setLoading(true);
    setError("");

    try {
      const data = await sendMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          toolCalls: data.toolCalls || [],
        },
      ]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        AI Chat
      </Typography>

      {messages.map((message, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography
            sx={{
              textAlign: message.role === "user" ? "right" : "left",
              color: message.role === "user" ? "#7047c6" : "#333",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
            {message.content}
          </Typography>

          {message.toolCalls?.length > 0 && (
            <Box
              sx={{
                mt: 1,
                ml: 2,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f8f6fc",
              }}
            >
              <Typography fontWeight="bold" mb={1}>
                Agent Tool Activity
              </Typography>

              {message.toolCalls.map((tool, toolIndex) => (
                <Box key={toolIndex} sx={{ mb: 2 }}>
                  <Typography fontWeight="bold" color="primary">
                    Tool: {tool.name}
                  </Typography>

                  <Typography variant="body2" fontWeight="bold" mt={1}>
                    Arguments:
                  </Typography>

                  <Box component="pre" sx={{ overflowX: "auto", fontSize: 12 }}>
                    {JSON.stringify(tool.arguments, null, 2)}
                  </Box>

                  <Typography variant="body2" fontWeight="bold">
                    Result:
                  </Typography>

                  <Box component="pre" sx={{ overflowX: "auto", fontSize: 12 }}>
                    {JSON.stringify(tool.result, null, 2)}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}

      {loading && (
        <Typography color="text.secondary">AI is thinking...</Typography>
      )}

      {error && <Typography color="error">{error}</Typography>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ display: "flex", gap: "10px", marginTop: "20px" }}
      >
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading || !input.trim()}
          sx={{ backgroundColor: "#7047c6", px: 3 }}
        >
          Send
        </Button>
      </form>
    </>
  );
};

export default Chat;
