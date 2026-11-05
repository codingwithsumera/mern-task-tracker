import { useState } from "react";

function TaskForm({ onAddTask, submitting }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const success = await onAddTask(trimmedTitle);

    if (success) {
      setTitle("");
    }
  }

  return (
    <section className="task-panel">
      <h2>Add a task</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you need to do?"
          aria-label="Task title"
          maxLength={200}
          disabled={submitting}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add task"}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
