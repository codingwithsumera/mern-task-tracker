import { createAgent } from "langchain";
import { ChatGoogle } from "@langchain/google";

import createTaskTools from "../tools/taskTools.js";

const createTaskAgent = (owner, toolCalls) => {
  const model = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const tools = createTaskTools(owner, toolCalls);

  const agent = createAgent({
    model,
    tools,
  });

  return agent;
};

export default createTaskAgent;
