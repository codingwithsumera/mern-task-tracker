const mongoose = require("mongoose");
const Task = require("../models/Task");

// GET /api/tasks?page=1&limit=5
const getTasks = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 5),
    );

    const skip = (page - 1) * limit;
    const owner = req.session.userId;

    const [tasks, totalTasks] = await Promise.all([
      Task.find({ owner }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments({ owner }),
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
    console.error("Get tasks error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      owner: req.session.userId,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// PATCH /api/tasks/:id
// PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const { title, completed } = req.body;
    const updates = {};

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty.",
        });
      }

      updates.title = title.trim();
    }

    // Validate completed if provided
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be a boolean.",
        });
      }

      updates.completed = completed;
    }

    // Ensure at least one valid field was provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide a title or completed status to update.",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        owner: req.session.userId,
      },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      owner: req.session.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
