require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = 5000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Task Tracker API is running!" });
});

app.use("/api/tasks", taskRoutes);

// Connect to MongoDB, then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
