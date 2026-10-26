require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables before starting.
if (!process.env.MONGO_URI) {
  console.error("Startup failed: MONGO_URI is not configured.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Task Tracker API is running!" });
});

app.use("/api/tasks", taskRoutes);

// JSON response for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Connect to MongoDB, then start the server.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("Startup failed: Could not connect to MongoDB.");
    process.exit(1);
  });
