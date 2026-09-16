const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

// All task routes require a valid JWT
router.use(protect);

router.route("/").get(getTasks).post(createTask);

router.route("/:id").put(updateTask).delete(deleteTask);

router.patch("/:id/status", updateTaskStatus);

module.exports = router;
