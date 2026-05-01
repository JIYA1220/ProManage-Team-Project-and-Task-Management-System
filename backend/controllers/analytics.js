const Task = require("../models/task");
const Project = require("../models/project");

const getAnalytics = async (req, res) => {
    // 1. Find all projects user belongs to
    const projects = await Project.find({
        $or: [
            { owner: req.user._id },
            { "members.user": req.user._id }
        ]
    });
    const projectIds = projects.map(p => p._id);

    const baseFilter = { projectId: { $in: projectIds } };

	let backlog = await Task.countDocuments({ ...baseFilter, category: "backlog" });
	let todo = await Task.countDocuments({ ...baseFilter, category: "to-do" });
	let inProgress = await Task.countDocuments({ ...baseFilter, category: "in-progress" });
	let done = await Task.countDocuments({ ...baseFilter, category: "done" });
	
    let high = await Task.countDocuments({ ...baseFilter, priority: "High Priority" });
	let moderate = await Task.countDocuments({ ...baseFilter, priority: "Moderate Priority" });
	let low = await Task.countDocuments({ ...baseFilter, priority: "Low Priority" });
	
    let dueDateCount = await Task.countDocuments({ ...baseFilter, dueDate: { $exists: true, $ne: null } });

    // Overdue tasks: dueDate < today and status != done
    const today = new Date();
    let overdue = await Task.countDocuments({
        ...baseFilter,
        dueDate: { $lt: today },
        category: { $ne: "done" }
    });

	res.status(200).send({
		message: "success",
		data: { 
            backlog, 
            todo, 
            inProgress, 
            done, 
            high, 
            moderate, 
            low, 
            dueDate: dueDateCount,
            overdue,
            totalTasks: backlog + todo + inProgress + done
        },
	});
};

module.exports = { getAnalytics };
