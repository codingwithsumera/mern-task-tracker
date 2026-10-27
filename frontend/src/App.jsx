import { useCallback, useEffect, useState } from "react";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Pagination from "./components/Pagination";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/taskService";

const PAGE_SIZE = 5;

function App() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks(page, PAGE_SIZE);

      setTasks(data.tasks || []);

      const pages =
        data.totalPages ??
        data.pagination?.totalPages ??
        data.pagination?.pages ??
        1;

      setTotalPages(Math.max(1, Number(pages) || 1));
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleAddTask(title) {
    setSubmitting(true);
    setError("");

    try {
      await createTask(title);

      if (page !== 1) {
        setPage(1);
      } else {
        await loadTasks();
      }

      return true;
    } catch (err) {
      setError(err.message || "Could not create the task.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleTask(task) {
    setBusyTaskId(task._id);
    setError("");

    try {
      await updateTask(task._id, !task.completed);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Could not update the task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleDeleteTask(taskId) {
    setBusyTaskId(taskId);
    setError("");

    try {
      await deleteTask(taskId);

      if (tasks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadTasks();
      }
    } catch (err) {
      setError(err.message || "Could not delete the task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">STAY ORGANIZED</p>
        <h1>Task Tracker</h1>
        <p className="subtitle">One task at a time. Make progress every day.</p>
      </header>

      <section className="task-panel">
        <TaskForm onAddTask={handleAddTask} submitting={submitting} />

        <div className="task-heading">
          <h2>Your tasks</h2>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          busyTaskId={busyTaskId}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          onPageChange={setPage}
        />
      </section>

      <footer className="app-footer">
        Your tasks are saved in the database.
      </footer>
    </main>
  );
}

export default App;
