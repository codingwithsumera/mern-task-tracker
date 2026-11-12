import { tool } from "@langchain/core/tools";
import { z } from "zod";

import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService.js";

const createTaskTools = (owner, toolCalls = []) => {
  const executeTool = async (name, args, operation) => {
    console.log(`Tool called: ${name}`, args);

    try {
      const result = await operation();

      console.log(`Tool result: ${name}`, result);

      // Save activity so the frontend can display it.
      toolCalls.push({
        name,
        arguments: args,
        result,
      });

      return JSON.stringify(result);
    } catch (error) {
      console.error(`Tool error: ${name}`, error);

      const result = {
        success: false,
        reason: "The operation failed unexpectedly.",
      };

      toolCalls.push({
        name,
        arguments: args,
        result,
      });

      return JSON.stringify(result);
    }
  };

  const listTasksTool = tool(
    async () => executeTool("listTasks", {}, () => listTasks(owner)),
    {
      name: "listTasks",
      description:
        "Retrieve all tasks belonging to the logged-in user. Use this when the user asks to view, find, or check their tasks. Returns task IDs, titles, completion statuses, and due dates.",
      schema: z.object({}),
    },
  );

  const createTaskTool = tool(
    async ({ title, dueDate }) =>
      executeTool("createTask", { title, dueDate }, () =>
        createTask(owner, title, dueDate),
      ),
    {
      name: "createTask",
      description:
        "Create a new task for the logged-in user. Requires a task title. A due date can optionally be provided as a date string.",
      schema: z.object({
        title: z.string().min(1).describe("The title of the new task."),
        dueDate: z.string().nullable().optional(),
      }),
    },
  );

  const updateTaskTool = tool(
    async ({ id, title, completed, dueDate }) =>
      executeTool("updateTask", { id, title, completed, dueDate }, () =>
        updateTask(owner, id, { title, completed, dueDate }),
      ),
    {
      name: "updateTask",
      description:
        "Update an existing task belonging to the logged-in user. Requires the task ID. Can update its title, completion status, or due date. Only provide fields that need to change.",
      schema: z
        .object({
          id: z.string().describe("The MongoDB ID of the task."),
          title: z.string().optional(),
          completed: z.boolean().optional(),
          dueDate: z.string().nullable().optional(),
        })
        .refine(
          ({ title, completed, dueDate }) =>
            title !== undefined ||
            completed !== undefined ||
            dueDate !== undefined,
          { message: "At least one field must be provided for an update." },
        ),
    },
  );

  const deleteTaskTool = tool(
    async ({ id }) =>
      executeTool("deleteTask", { id }, () => deleteTask(owner, id)),
    {
      name: "deleteTask",
      description:
        "Permanently delete a task belonging to the logged-in user. Use only when the user explicitly asks to delete a task.",
      schema: z.object({
        id: z.string().describe("The MongoDB ID of the task."),
      }),
    },
  );

  return [listTasksTool, createTaskTool, updateTaskTool, deleteTaskTool];
};

export default createTaskTools;
