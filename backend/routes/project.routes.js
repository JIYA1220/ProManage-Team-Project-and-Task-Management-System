const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/authorization");
const { isProjectAdmin, isProjectMember } = require("../middlewares/projectMiddleware");
const projectController = require("../controllers/project");
const wrapAsync = require("../middlewares/wrapAsync");

router.post("/", authorization, wrapAsync(projectController.createProject));
router.get("/", authorization, wrapAsync(projectController.getProjects));
router.get("/:id", authorization, isProjectMember, wrapAsync(projectController.getProjectById));
router.post("/:id/members", authorization, isProjectAdmin, wrapAsync(projectController.addMember));
router.delete("/:id/members/:userId", authorization, isProjectAdmin, wrapAsync(projectController.removeMember));

module.exports = router;
