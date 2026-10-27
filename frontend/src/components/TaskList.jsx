function TaskList({ tasks, loading, busyTaskId, onToggleTask, onDeleteTask }) {
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
      {tasks.map((task) => (
        <li
          className={`task-item ${task.completed ? "completed" : ""}`}
          key={task._id}
        >
          <div className="task-details">
            <span className="task-title">{task.title}</span>

            <span
              className={`status-label ${
                task.completed ? "status-done" : "status-pending"
              }`}
            ></span>
          </div>

          <div className="task-actions">
            <button
              type="button"
              className="status-button"
              onClick={() => onToggleTask(task)}
              disabled={busyTaskId === task._id}
            >
              {busyTaskId === task._id
                ? "Updating..."
                : task.completed
                  ? "Mark as pending"
                  : "Mark complete"}
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() => onDeleteTask(task._id)}
              disabled={busyTaskId === task._id}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
