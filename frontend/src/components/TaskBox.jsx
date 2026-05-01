import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TbDots } from "react-icons/tb";
import { TaskMenu } from "./PopUp";
import { getMonthDate } from "../utils/generateDate";
import { useDispatch, useSelector } from "react-redux";
import {
	setCategoryName,
	setTaskMId,
	setUpdateCategoryM,
} from "../redux/slices/stateSlice";
import CheckBoxUnselect from "../assets/checkbox_unselect.png";
import CheckBoxSelect from "../assets/checkbox_select.png";

import useUpdateTask from "../hooks/useUpdateTask";
import useUpdateCategory from "../hooks/useUpdateCategory";

const TaskBox = ({
	backlogCollapse,
	todoCollapse,
	progressCollapse,
	doneCollapse,
	task,
}) => {
	const [collapse, setCollapse] = React.useState(true);
	const [taskMenuP, setTaskMenuP] = React.useState(false);
    const [load, setLoad] = React.useState("");
	const dispatch = useDispatch();
    const currentProjectId = useSelector((state) => state.state.currentProjectId);

	const handleClickOutside = (event) => {
		if (taskMenuP && !event?.target.closest(".popup-box")) {
			setTaskMenuP(false);
		}
	};

	const handleUpdateCategory = (category) => {
        useUpdateCategory(
            dispatch,
            task?._id,
            category,
            currentProjectId
        );
	};

    const handleToggleChecklist = (idx) => {
        const newChecklist = task.checklist.map((item, i) => 
            i === idx ? { ...item, isDone: !item.isDone } : item
        );
        
        useUpdateTask(
            { target: { disabled: false } }, // mock event
            setLoad,
            task.title,
            task.priority,
            newChecklist,
            task.assign,
            task.dueDate,
            dispatch,
            task._id,
            true
        );
    };

	React.useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [taskMenuP]);

	React.useEffect(() => {
		setCollapse(true);
	}, [backlogCollapse, todoCollapse, progressCollapse, doneCollapse]);
	return (
		<div className="task-box">
			<div className="priority-menu">
				<div>
					<div
						className={`circle-box ${task?.priority
							?.split(" ")[0]
							?.toLowerCase()}-box`}
					></div>
					<p>{task?.priority}</p>
					<div className="circle-name-box">
						{task?.userName?.name?.split(" ")[0]?.slice(0, 1) +
							(task?.userName?.name?.split(" ")[1] == undefined
								? ""
								: task?.userName?.name
										?.split(" ")[1]
										?.slice(0, 1)
										.toUpperCase())}
					</div>
				</div>
				<div className="relative">
					<TbDots
						fontSize={18}
						cursor={"pointer"}
						onClick={() => {
							setTaskMenuP(true);
							dispatch(setTaskMId(task?._id));
						}}
					/>
					{taskMenuP && (
						<TaskMenu
							setTaskMenuP={setTaskMenuP}
							id={task?._id}
							task={task}
						/>
					)}
				</div>
			</div>
			<h3 title={task?.title}>{task?.title}</h3>
			<div className="task-checklist">
				<p>
					Checklist (
					{
						task?.checklist.filter((list) => list.isDone == true)
							.length
					}
					/{task?.checklist.length})
				</p>
				<div onClick={() => setCollapse(!collapse)}>
					{collapse ? <IoIosArrowDown /> : <IoIosArrowUp />}
				</div>
			</div>
			<div
				className={`task-checklist-details ${
					collapse && "task-checklist-details-collapse"
				}`}
			>
				{task?.checklist.map((list, idx) => {
					return (
						<label
							key={idx + "checklist-box"}
							className="checklist-details-box"
                            onClick={() => handleToggleChecklist(idx)}
                            style={{ cursor: "pointer" }}
						>
							{!list.isDone ? (
								<img src={CheckBoxUnselect} alt="unchecked" />
							) : (
								<img src={CheckBoxSelect} alt="checked" />
							)}
							<span>{list.name}</span>
						</label>
					);
				})}
			</div>
			<div className="task-btns">
				{task?.dueDate ? (
					<div
						className={`task-btn task-btn-red ${
							task?.category == "done" && "task-btn-green"
						}`}
					>
						{getMonthDate(task?.dueDate)}
					</div>
				) : (
					<div></div>
				)}
				<div>
					{task?.category != "backlog" && (
						<div
							className="task-btn"
							onClick={() => handleUpdateCategory("backlog")}
						>
							BACKLOG
						</div>
					)}
					{task?.category != "to-do" && (
						<div
							className="task-btn"
							onClick={() => handleUpdateCategory("to-do")}
						>
							TO-DO
						</div>
					)}
					{task?.category != "in-progress" && (
						<div
							className="task-btn"
							onClick={() => handleUpdateCategory("in-progress")}
						>
							PROGRESS
						</div>
					)}
					{task?.category != "done" && (
						<div
							className="task-btn"
							onClick={() => handleUpdateCategory("done")}
						>
							DONE
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskBox;
