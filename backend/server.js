require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Connect to MongoDB before starting the server
connectDB();

const app = express();

// --- Middleware ---

// Allow requests from the frontend origin(s) defined in .env
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json()); // parse JSON request bodies

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "Taskora API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler - must be registered last
app.use(errorHandler);

// --- Safety nets for uncaught errors so the process doesn't crash silently ---
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Taskora backend running on port ${PORT}`);
});
