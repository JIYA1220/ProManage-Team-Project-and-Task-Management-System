const Project = require("../models/project");
const wrapAsync = require("./wrapAsync");

const isProjectAdmin = wrapAsync(async (req, res, next) => {
    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    if (!projectId) {
        // If no project ID, assume it's a personal task and allow
        return next();
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdminMember = project.members.some(
        (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );

    if (isOwner || isAdminMember || req.user.role === "admin") {
        req.project = project;
        return next();
    }

    return res.status(403).json({ message: "Access denied: Admins only" });
});

const isProjectMember = wrapAsync(async (req, res, next) => {
    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    if (!projectId) {
        // If no project ID, assume it's a personal task and allow
        return next();
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some(
        (m) => m.user.toString() === req.user._id.toString()
    );

    if (isOwner || isMember || req.user.role === "admin") {
        req.project = project;
        return next();
    }

    return res.status(403).json({ message: "Access denied: Members only" });
});

module.exports = { isProjectAdmin, isProjectMember };
