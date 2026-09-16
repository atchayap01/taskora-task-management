const Task = require("../models/Task");
const { asyncHandler } = require("../middleware/errorHandler");

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

// Escapes characters that have special meaning in a regular expression so
// user-supplied search text (e.g. "C++", "Java*", "test?") is treated as
// literal text instead of being interpreted as regex syntax. Without this,
// searches containing +, *, ?, (, ), etc. throw "Invalid regular expression".
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route   GET /api/tasks
// @access  Private
// Supports optional query params: status, priority, search
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;

  // Always scope to the logged-in user - this is the core authorization rule
  const filter = { user: req.user._id };

  if (status && VALID_STATUSES.includes(status)) {
    filter.status = status;
  }

  if (priority && VALID_PRIORITIES.includes(priority)) {
    filter.priority = priority;
  }

  if (search && search.trim()) {
    const safeSearch = escapeRegex(search.trim());
    const regex = new RegExp(safeSearch, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
  }

  const task = await Task.create({
    user: req.user._id,
    title: title.trim(),
    description: description ? description.trim() : "",
    status: status || "Pending",
    priority: priority || "Medium",
    dueDate: dueDate || null,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
  }

  // Critical authorization check: only find a task that belongs to THIS user.
  // If a user changes the :id in the URL to someone else's task, this query
  // returns null instead of leaking or modifying another user's data.
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  res.status(200).json({
    success: true,
    task,
  });
});

// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.status = status;
  await task.save();

  res.status(200).json({
    success: true,
    task,
  });
});

// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  // Same authorization pattern as updateTask - scoped to req.user._id
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
