const express = require("express");
const router = express.Router();
const {
	getTask,
	getAllTask,
	addTask,
	updateTask,
	deleteTask,
	updateCategory,
    assignTask
} = require("../controllers/task");
const wrapAsync = require("../middlewares/wrapAsync");
const { authorization } = require("../middlewares/authorization");
const { isProjectAdmin, isProjectMember } = require("../middlewares/projectMiddleware");

// GET /api/tasks (with optional projectId)
router.get("/", authorization, wrapAsync(getAllTask));

// Legacy /all route
router.get("/all", authorization, wrapAsync(getAllTask));

router.get("/:id", wrapAsync(getTask));

// POST /api/tasks
router.post("/", authorization, isProjectAdmin, wrapAsync(addTask));

// PATCH /api/tasks/:id (Generic update)
router.patch("/:id", authorization, wrapAsync(updateTask));

// PATCH /api/tasks/:id/status
router.patch("/:id/status", authorization, wrapAsync(updateCategory));

// PATCH /api/tasks/:id/assign
router.patch("/:id/assign", authorization, isProjectAdmin, wrapAsync(assignTask));

router.delete("/:id", authorization, isProjectAdmin, wrapAsync(deleteTask));

module.exports = router;
