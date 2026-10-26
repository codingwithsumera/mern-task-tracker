const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks?page=1&limit=5
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 5),
    );

    const skip = (page - 1) * limit;

    const [tasks, totalTasks] = await Promise.all([
      Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(),
    ]);

    return res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({ title: title.trim() });

    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// PATCH /api/tasks/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be a boolean.",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(task);
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
