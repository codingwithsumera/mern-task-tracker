import mongoose from "mongoose";
import Task from "../models/Task.js";

// LIST TASKS
const listTasks = async (owner, page = null, limit = null) => {
  try {
    if (page !== null && limit !== null) {
      const skip = (page - 1) * limit;

      const [tasks, totalTasks] = await Promise.all([
        Task.find({ owner }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Task.countDocuments({ owner }),
      ]);

      return {
        success: true,
        tasks,
        pagination: {
          currentPage: page,
          limit,
          totalTasks,
          totalPages: Math.ceil(totalTasks / limit),
        },
      };
    }

    const tasks = await Task.find({ owner }).sort({ createdAt: -1 });

    return { success: true, tasks };
  } catch (error) {
    console.error("List tasks error:", error);

    return {
      success: false,
      reason: "Unable to retrieve tasks.",
    };
  }
};

// CREATE TASK
// CREATE TASK
const createTask = async (owner, title, dueDate = null) => {
  try {
    if (typeof title !== "string" || !title.trim()) {
      return {
        success: false,
        reason: "Task title is required.",
      };
    }

    let validDueDate = null;

    if (dueDate !== null && dueDate !== undefined && dueDate !== "") {
      const date = new Date(dueDate);

      if (Number.isNaN(date.getTime())) {
        return {
          success: false,
          reason: "Invalid due date.",
        };
      }

      validDueDate = date;
    }

    const task = await Task.create({
      title: title.trim(),
      dueDate: validDueDate,
      owner,
    });

    return {
      success: true,
      task,
    };
  } catch (error) {
    console.error("Create task error:", error);

    return {
      success: false,
      reason: "Unable to create task.",
    };
  }
};

// UPDATE TASK
const updateTask = async (owner, id, updates) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return {
        success: false,
        reason: "Invalid task ID.",
      };
    }

    const allowedUpdates = {};

    if (updates.title !== undefined) {
      if (typeof updates.title !== "string" || !updates.title.trim()) {
        return {
          success: false,
          reason: "Task title cannot be empty.",
        };
      }

      allowedUpdates.title = updates.title.trim();
    }

    if (updates.completed !== undefined) {
      if (typeof updates.completed !== "boolean") {
        return {
          success: false,
          reason: "Completed must be a boolean.",
        };
      }

      allowedUpdates.completed = updates.completed;
    }

    if (updates.dueDate !== undefined) {
      if (updates.dueDate !== null) {
        const date = new Date(updates.dueDate);

        if (Number.isNaN(date.getTime())) {
          return {
            success: false,
            reason: "Invalid due date.",
          };
        }

        allowedUpdates.dueDate = date;
      } else {
        allowedUpdates.dueDate = null;
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return {
        success: false,
        reason: "No valid fields provided for update.",
      };
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        owner,
      },
      { $set: allowedUpdates },
      { new: true, runValidators: true },
    );

    if (!task) {
      return {
        success: false,
        reason: "Task not found.",
      };
    }

    return {
      success: true,
      task,
    };
  } catch (error) {
    console.error("Update task error:", error);

    return {
      success: false,
      reason: "Unable to update task.",
    };
  }
};

// DELETE TASK
const deleteTask = async (owner, id) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return {
        success: false,
        reason: "Invalid task ID.",
      };
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      owner,
    });

    if (!task) {
      return {
        success: false,
        reason: "Task not found.",
      };
    }

    return {
      success: true,
      message: "Task deleted successfully.",
    };
  } catch (error) {
    console.error("Delete task error:", error);

    return {
      success: false,
      reason: "Unable to delete task.",
    };
  }
};

export { listTasks, createTask, updateTask, deleteTask };
