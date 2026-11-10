import api from "./api";

const sendMessage = async (message) => {
  const response = await api.post("/chat", { message });
  return response.data;
};

export { sendMessage };
