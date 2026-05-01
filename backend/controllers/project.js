const Project = require("../models/project");
const User = require("../models/user");
const Task = require("../models/task");

const createProject = async (req, res) => {
    const { title, description } = req.body;
    const project = new Project({
        title,
        description,
        owner: req.user._id,
        members: [{ user: req.user._id, role: "admin" }]
    });
    await project.save();
    res.status(201).json(project);
};

const getProjects = async (req, res) => {
    const projects = await Project.find({
        $or: [
            { owner: req.user._id },
            { "members.user": req.user._id }
        ]
    }).populate("owner", "name email");
    res.status(200).json(projects);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate("owner", "name email")
        .populate("members.user", "name email");
    
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ projectId: project._id });
    res.status(200).json({ project, tasks });
};

const addMember = async (req, res) => {
    const { email, role } = req.body;
    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    if (!userToAdd) {
        return res.status(404).json({ message: "User not found" });
    }

    const project = req.project;
    const isAlreadyMember = project.members.some(
        (m) => m.user.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
        return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({ user: userToAdd._id, role: role || "member" });
    await project.save();

    // Also sync with current user's (admin's) board for task assignment dropdown
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { board: email.toLowerCase() }
    });

    res.status(200).json(project);
};

const removeMember = async (req, res) => {
    const { userId } = req.params;
    const project = req.project;

    if (project.owner.toString() === userId) {
        return res.status(400).json({ message: "Cannot remove project owner" });
    }

    project.members = project.members.filter(
        (m) => m.user.toString() !== userId
    );
    await project.save();
    res.status(200).json(project);
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    addMember,
    removeMember
};
