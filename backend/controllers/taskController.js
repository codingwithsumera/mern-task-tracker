import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService.js";

// GET /api/tasks
const getTasks = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 5));

  const result = await listTasks(req.session.userId, page, limit);

  if (!result.success) {
    return res.status(500).json({ message: result.reason });
  }

  return res.status(200).json({
    tasks: result.tasks,
    pagination: result.pagination,
  });
};

// POST /api/tasks
const addTask = async (req, res) => {
  const { title, dueDate } = req.body;

  const result = await createTask(req.session.userId, title, dueDate);

  if (!result.success) {
    return res.status(400).json({ message: result.reason });
  }

  return res.status(201).json(result.task);
};

// PATCH /api/tasks/:id
const editTask = async (req, res) => {
  const result = await updateTask(req.session.userId, req.params.id, req.body);

  if (!result.success) {
    const status = result.reason === "Task not found." ? 404 : 400;
    return res.status(status).json({ message: result.reason });
  }

  return res.status(200).json(result.task);
};

// DELETE /api/tasks/:id
const removeTask = async (req, res) => {
  const result = await deleteTask(req.session.userId, req.params.id);

  if (!result.success) {
    const status = result.reason === "Task not found." ? 404 : 400;
    return res.status(status).json({ message: result.reason });
  }

  return res.status(204).send();
};

export {
  getTasks,
  addTask as createTask,
  editTask as updateTask,
  removeTask as deleteTask,
};
