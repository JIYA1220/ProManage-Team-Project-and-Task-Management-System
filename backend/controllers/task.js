const Task = require("../models/task");
const Project = require("../models/project");

const getTask = async (req, res) => {
	const { id } = req.params;
	let task = await Task.findById(id).populate("userName", "name");
	res.status(200).send({ message: "success", data: task });
};

const getAllTask = async (req, res) => {
    let { projectId } = req.query;
    
    // Find all projects user belongs to (as owner or member)
    const userProjects = await Project.find({
        $or: [
            { owner: req.user._id },
            { "members.user": req.user._id }
        ]
    });
    const projectIds = userProjects.map(p => p._id);

    const daysAgo = (days) => new Date(new Date() - days * 24 * 3600000);
    const filter = {
        createdAt: { $gte: daysAgo(req.query.days || 365) }
    };

    if (projectId) {
        // If specific project requested, verify user has access
        if (!projectIds.map(id => id.toString()).includes(projectId.toString()) && req.user.role !== 'admin') {
            return res.status(403).json({ message: "No access to this project" });
        }
        filter.projectId = projectId;
    } else {
        // Global board: Show tasks from all user's projects OR tasks assigned/created by user
        filter.$or = [
            { projectId: { $in: projectIds } },
            { userName: req.user._id },
            { assign: req.user.email }
        ];
    }

	let backlog = await Task.find({ ...filter, category: "backlog" }).populate("userName", "name");
	let todo = await Task.find({ ...filter, category: "to-do" }).populate("userName", "name");
	let inProgress = await Task.find({ ...filter, category: "in-progress" }).populate("userName", "name");
	let done = await Task.find({ ...filter, category: "done" }).populate("userName", "name");

	res.status(200).send({
		message: "success",
		data: { backlog, todo, inProgress, done },
	});
};

const addTask = async (req, res) => {
	let { title, priority, checklist, dueDate, assign, projectId } = req.body;
	let userName = req.user._id;
	let newTask = new Task({
		title,
		priority,
		checklist,
		dueDate,
		userName,
		assign,
        projectId
	});
	let createTask = await newTask.save();
	let task = await Task.findById(createTask._id).populate({
		path: "userName",
		select: "name",
	});
	res.status(200).send({ message: "success", data: task });
};

const updateTask = async (req, res) => {
	let { title, priority, checklist, dueDate, assign } = req.body;
	const { id } = req.params;
	
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    // PERMISSIVE: If you are logged in, you can update tasks you have access to
	let updatedTask = await Task.findByIdAndUpdate(
		id,
		{ title, priority, checklist, dueDate, assign },
		{ new: true }
	).populate("userName", "name");

	res.status(200).send({ message: "success", data: updatedTask });
};

const deleteTask = async (req, res) => {
	const { id } = req.params;
	const deleteTask = await Task.findByIdAndDelete(id);
	res.status(200).send({ message: "success", data: deleteTask });
};

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const { category } = req.body;
    
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // PERMISSIVE: Anyone who can see the task can move it
	const updatedTask = await Task.findByIdAndUpdate(
		id,
		{ category: category },
		{ new: true }
	).populate("userName", "name");

	return res.status(200).json({
		message: "success",
		data: updatedTask,
	});
};

const assignTask = async (req, res) => {
    const { id } = req.params;
    const { assign } = req.body; // email

    let task = await Task.findByIdAndUpdate(
        id,
        { assign },
        { new: true }
    ).populate("userName", "name");

    res.status(200).send({ message: "success", data: task });
};

module.exports = {
	getTask,
	getAllTask,
	addTask,
	updateTask,
	deleteTask,
	updateCategory,
    assignTask
};
