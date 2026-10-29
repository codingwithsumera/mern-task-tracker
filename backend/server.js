require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("Startup failed: MONGO_URI is not configured.");
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error("Startup failed: SESSION_SECRET is not configured.");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// Session configuration
app.use(
  session({
    name: "task_tracker.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Local HTTP development only
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Task Tracker API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// JSON response for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

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
    console.error(
      "Startup failed: Could not connect to MongoDB.",
      error.message,
    );
    process.exit(1);
  });
