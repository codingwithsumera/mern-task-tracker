import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Pagination from "./components/Pagination";
import Login from "./components/Login";
import Register from "./components/Register";

import { useAuth } from "./context/AuthContext";
import taskService from "./services/taskService";

const PAGE_SIZE = 5;

function App() {
  const { user, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [authMode, setAuthMode] = useState("login");
  const [error, setError] = useState("");

  // Fetch tasks for the logged-in user
  const {
    data,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", page, PAGE_SIZE],
    queryFn: () =>
      taskService.getTasks({
        page,
        limit: PAGE_SIZE,
      }),
    enabled: !!user,
  });

  const tasks = data?.tasks || [];
  const totalPages = Math.max(
    1,
    Number(
      data?.totalPages ??
        data?.pagination?.totalPages ??
        data?.pagination?.pages ??
        1,
    ),
  );

  // Create task
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      setError("");
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Could not create task.");
    },
  });

  // Update task
  const updateMutation = useMutation({
    mutationFn: ({ id, completed }) =>
      taskService.updateTask(id, { completed }),
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Could not update task.");
    },
  });

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Could not delete task.");
    },
  });

  async function handleAddTask(title) {
    setError("");
    try {
      await createMutation.mutateAsync({ title });
      return true;
    } catch {
      return false;
    }
  }

  function handleToggleTask(task) {
    setError("");
    updateMutation.mutate({
      id: task._id,
      completed: !task.completed,
    });
  }

  function handleDeleteTask(taskId) {
    setError("");
    deleteMutation.mutate(taskId);
  }

  async function handleLogout() {
    try {
      await logout();
      setPage(1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log out.");
    }
  }

  // Check authentication
  if (isLoading) {
    return <p>Checking your session...</p>;
  }

  // Show authentication screens
  if (!user) {
    return (
      <main className="app">
        <header className="app-header">
          <p className="eyebrow">STAY ORGANIZED</p>
          <h1>Task Tracker</h1>
          <p className="subtitle">
            One task at a time. Make progress every day.
          </p>
        </header>

        <section className="task-panel">
          {authMode === "login" ? (
            <>
              <Login />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setAuthMode("register")}>
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register />
              <p>
                Already have an account?{" "}
                <button onClick={() => setAuthMode("login")}>Login</button>
              </p>
            </>
          )}
        </section>
      </main>
    );
  }

  // Show task application
  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">STAY ORGANIZED</p>
        <h1>Task Tracker</h1>
        <p className="subtitle">Welcome, {user.name}</p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="task-panel">
        <TaskForm
          onAddTask={handleAddTask}
          submitting={createMutation.isPending}
        />

        <div className="task-heading">
          <h2>Your tasks</h2>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
        </div>

        {(error || tasksError) && (
          <div className="error-message" role="alert">
            {error ||
              tasksError?.response?.data?.message ||
              "Could not load tasks."}
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          busyTaskId={
            updateMutation.isPending
              ? updateMutation.variables?.id
              : deleteMutation.isPending
                ? deleteMutation.variables
                : null
          }
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          loading={tasksLoading}
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
