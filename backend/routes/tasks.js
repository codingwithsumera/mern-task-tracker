const express = require("express");
const Task = require("../models/Task");

const router = express.Router();
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch tasks(Unexpected Errors).",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create task.",
    });
  }
});

module.exports = router;
