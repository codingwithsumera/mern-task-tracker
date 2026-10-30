import { useState } from "react";

function TaskList({
  tasks,
  loading,
  busyTaskId,
  onToggleTask,
  onDeleteTask,
  onUpdateTitle,
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editError, setEditError] = useState("");

  function handleEditClick(task) {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditError("");
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setEditedTitle("");
    setEditError("");
  }

  async function handleSaveEdit(taskId) {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      setEditError("Task title cannot be empty.");
      return;
    }

    const success = await onUpdateTitle(taskId, trimmedTitle);

    if (success) {
      handleCancelEdit();
    }
  }

  if (loading) {
    return <p className="status-message">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks on this page</h3>
        <p>Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const isEditing = editingTaskId === task._id;
        const isBusy = busyTaskId === task._id;

        return (
          <li
            className={`task-item ${task.completed ? "completed" : ""}`}
            key={task._id}
          >
            <div className="task-details">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(event) => setEditedTitle(event.target.value)}
                    maxLength={200}
                    disabled={isBusy}
                    autoFocus
                    aria-label="Edit task title"
                  />
                  {editError && <p className="error-message">{editError}</p>}
                </div>
              ) : (
                <span className="task-title">{task.title}</span>
              )}

              <span
                className={`status-label ${
                  task.completed ? "status-done" : "status-pending"
                }`}
              ></span>
            </div>

            <div className="task-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(task._id)}
                    disabled={isBusy}
                  >
                    {isBusy ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isBusy}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEditClick(task)}
                    disabled={isBusy}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className={`status-button ${
                      task.completed ? "pending-button" : "complete-button"
                    }`}
                    onClick={() => onToggleTask(task)}
                    disabled={isBusy}
                  >
                    {isBusy
                      ? "Updating..."
                      : task.completed
                        ? "↶ Mark as pending"
                        : "✓ Mark as complete"}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDeleteTask(task._id)}
                    disabled={isBusy}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
