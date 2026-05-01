const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		members: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				role: {
					type: String,
					enum: ["admin", "member"],
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
