import React from "react";
import "../css/Model.css";
import { useDispatch, useSelector } from "react-redux";
import {
	setAddedPeopleM,
	setAddPeopleM,
	setLogoutM,
	setTaskDeleteM,
	setTaskCardM,
	setTaskM,
	setBoardEmail,
	setCategoryName,
	setUpdateCategoryM,
} from "../redux/slices/stateSlice";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { PiCodesandboxLogoDuotone } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeAuth } from "../redux/slices/authSlice";
import useAddTask from "../hooks/useAddTask";
import { toast } from "react-toastify";
import useDeleteTask from "../hooks/useDeleteTask";
import useGetTask from "../hooks/useGetTask";
import Loading from "./Loading";
import { getMonthDate, simpleDate } from "../utils/generateDate";
import useUpdateTask from "../hooks/useUpdateTask";
import CheckBoxUnselect from "../assets/checkbox_unselect.png";
import CheckBoxSelect from "../assets/checkbox_select.png";
import useAddToBoard from "../hooks/useAddToBoard";
import { checkValidEmail } from "../utils/validate";
import useUpdateCategory from "../hooks/useUpdateCategory";
import getHeader from "../utils/header";

export const AddPeople = () => {
	const dispatch = useDispatch();
	const [email, setEmail] = React.useState("");
	const [load, setLoad] = React.useState("");
	const handleAddToBoard = (e) => {
		const validError = checkValidEmail(email);
		if (validError) {
			toast.error(validError);
			return;
		}
		useAddToBoard(e, setLoad, dispatch, email);
	};
	return (
		<div className="model-container">
			<div className="model-box">
				<h3>Add people to the board</h3>
				<input
					type="email"
					name="email"
					placeholder="Enter the email"
					className="model-input"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<div className="model-btns">
					<button
						className="model-cancel"
						onClick={() => dispatch(setAddPeopleM(false))}
					>
						Cancel
					</button>
					<button
						className="model-submit"
						onClick={(e) => handleAddToBoard(e)}
					>
						{load ? "Loading..." : "Add Email"}
					</button>
				</div>
			</div>
		</div>
	);
};
export const AddedPeople = () => {
	const dispatch = useDispatch();
	const email = useSelector((store) => store.state.boardEmail);
	return (
		<div className="model-container">
			<div className="model-box">
				<h3 className="model-center">{email} added to board</h3>
				<div className="model-btns">
					<button
						className="model-submit"
						onClick={() => {
							dispatch(setAddedPeopleM(false));
							dispatch(setBoardEmail(""));
						}}
					>
						Okey, got it!
					</button>
				</div>
			</div>
		</div>
	);
};

export const UpdateCategory = () => {
	const dispatch = useDispatch();
	const [load, setLoad] = React.useState("");
	const { oldCategory, newCategory } = useSelector(
		(store) => store.state.categoryName
	);
	const taskId = useSelector((store) => store.state.taskMId);
	const handleUpdateCategory = (e) => {
		useUpdateCategory(
			e,
			setLoad,
			dispatch,
			taskId,
			newCategory,
			oldCategory
		);
	};
	return (
		<div className="model-container">
			<div className="model-box model-box-s">
				<h3 className="model-center">
					Change the status of task (
					{newCategory.charAt(0).toUpperCase() + newCategory.slice(1)}
					)
				</h3>
				<div className="model-btns">
					<button
						className="model-submit"
						onClick={(e) => handleUpdateCategory(e)}
					>
						{load ? "Loading..." : "Update status"}
					</button>
					<button
						className="model-cancel"
						onClick={() => {
							dispatch(setUpdateCategoryM(false));
							dispatch(setCategoryName(""));
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export const Logout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch(removeAuth());
		dispatch(setLogoutM(false));
		navigate("/login");
	};
	return (
		<div className="model-container">
			<div className="model-box model-box-s">
				<h3 className="model-center">
					Are you sure you want to Logout?
				</h3>
				<div className="model-btns">
					<button className="model-submit" onClick={handleLogout}>
						Yes, Logout
					</button>
					<button
						className="model-cancel"
						onClick={() => dispatch(setLogoutM(false))}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
export const TaskDelete = () => {
	const dispatch = useDispatch();
	const id = useSelector((store) => store.state.taskMId);
	const [load, setLoad] = React.useState("");
	const handleTaskDelete = (e) => {
		useDeleteTask(e, setLoad, dispatch, id);
	};

	return (
		<div className="model-container">
			<div className="model-box model-box-s">
				<h3 className="model-center">
					Are you sure you want to Delete?
				</h3>
				<div className="model-btns">
					<button
						className="model-submit"
						onClick={(e) => handleTaskDelete(e)}
					>
						{load ? "Loading..." : "Yes, Delete"}
					</button>
					<button
						className="model-cancel"
						onClick={() => dispatch(setTaskDeleteM(false))}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
export const TaskCard = () => {
	const task = useSelector((store) => store.state.taskM);
	const auth = useSelector((store) => store.auth);
    const currentProjectId = useSelector((store) => store.state.currentProjectId);

	const dispatch = useDispatch();
	const [dueDate, setDueDate] = React.useState(task?.dueDate || "");
	const [title, setTitle] = React.useState(task?.title || "");
	const [priority, setPriority] = React.useState(task?.priority || "");
	const [checklist, setChecklist] = React.useState(task?.checklist || []);
	const [listBox, setListBox] = React.useState(task?.checklist?.length || 0);
	const [load, setLoad] = React.useState("");
	const [assignBox, setAssignBox] = React.useState(false);
	const [assign, setAssign] = React.useState(task?.assign || "");
    const [projectMembers, setProjectMembers] = React.useState([]);

    React.useEffect(() => {
        if (currentProjectId) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${currentProjectId}`, {
                headers: getHeader()
            })
            .then(res => res.json())
            .then(json => {
                if (json?.project?.members) {
                    const emails = json.project.members
                        .map(m => m.user?.email)
                        .filter(email => Boolean(email));
                    setProjectMembers(emails);
                }
            })
            .catch(err => console.error("Fetch project members error:", err));
        }
    }, [currentProjectId]);

	const handleAddTask = (e) => {
		if (title && priority && checklist.length > 0) {
			const listName = checklist.filter((list) => {
				return list.name == "";
			});
			if (listName.length == 0) {
				if (task == "") {
					useAddTask(
						e,
						setLoad,
						title,
						priority,
						checklist,
						assign,
						dueDate,
						dispatch,
                        currentProjectId
					);
				} else {
					useUpdateTask(
						e,
						setLoad,
						title,
						priority,
						checklist,
						assign,
						dueDate,
						dispatch,
						task._id
					);
				}
			} else {
				toast.error("Checklist is required");
			}
		} else {
			toast.error("All fields are required");
		}
	};

	const handleAddChecklist = () => {
		let list = checklist;
		list = [...list, { name: "", isDone: false }];
		setChecklist(list);
		setListBox(list.length);
	};
	const handleDeleteChecklist = (idx) => {
		if (listBox > 0) {
			let list = checklist;
			list = list.filter((item, i) => i != idx);
			setChecklist(list);
			setListBox(list.length);
		}
	};

	const handleTitle = (name) => {
		name = name.charAt(0).toUpperCase() + name.slice(1);
		setTitle(name);
	};
	return (
		<div className="model-container">
			<form
				className="model-box model-card"
				onSubmit={(e) => {
					e.preventDefault();
					handleAddTask(e);
				}}
			>
				<div className="model-card-details">
					<span>
						Title <span className="require">*</span>
					</span>
					<input
						type="text"
						name="title"
						value={title}
						placeholder="Enter Task Title"
						className="model-input"
						onChange={(e) => handleTitle(e.target.value)}
					/>
					<div className="priority-box">
						<span>
							Select Priority <span className="require">*</span>
						</span>
						<div>
							<input
								type="radio"
								name="priority"
								value={priority}
								onClick={() => setPriority("High Priority")}
								id="high"
							/>
							<label
								htmlFor="high"
								className={`${
									priority == "High Priority" &&
									"selected-priority"
								}`}
							>
								<div
									className="priority-circel"
									style={{ background: "red" }}
								></div>
								<span>High Priority</span>
							</label>
							<input
								type="radio"
								name="priority"
								value={priority}
								onClick={() => setPriority("Moderate Priority")}
								id="moderate"
							/>
							<label
								htmlFor="moderate"
								className={`${
									priority == "Moderate Priority" &&
									"selected-priority"
								}`}
							>
								<div
									className="priority-circel"
									style={{ background: "#18B0FF" }}
								></div>
								<span>Moderate Priority</span>
							</label>
							<input
								type="radio"
								name="priority"
								value={priority}
								onClick={() => setPriority("Low Priority")}
								id="low"
							/>
							<label
								htmlFor="low"
								className={`${
									priority == "Low Priority" &&
									"selected-priority"
								}`}
							>
								<div
									className="priority-circel"
									style={{ background: "#63C05B" }}
								></div>
								<span>Low Priority</span>
							</label>
						</div>
					</div>
					{(auth?.board?.length != 0 || projectMembers.length != 0) && (
						<div className="model-assign">
							<span>Assign to</span>
							<div className="assign-model-box">
								<div
									className="model-input model-assign-input"
									onClick={() => setAssignBox(true)}
								>
									{assign ? (
										assign
									) : (
										<div className="assign-unselect-color">
											Add a assignee
										</div>
									)}
								</div>
								<div
									className={`assign-selection-box ${
										assignBox &&
										"assign-selection-box-exist"
									}`}
								>
									<div>
										<div>Don't assign to any email</div>
										<button
											type="button"
											onClick={() => {
												setAssign("");
												setAssignBox(false);
											}}
										>
											Cancel
										</button>
									</div>
									{assign && (
										<div>
											<div>
												Don't change to assign email
											</div>
											<button
												type="button"
												onClick={() => {
													setAssignBox(false);
												}}
											>
												Back &nbsp;
											</button>
										</div>
									)}
									{(currentProjectId ? projectMembers : auth?.board)?.map((item, idx) => {
                                        if (!item) return null;
										return (
											<div key={idx + "assign-box"}>
												<div title={item}>
													<span className="assign-circel">
														{item
															.split("")[0]
															?.toUpperCase()}
													</span>{" "}
													{item}
												</div>
												<button
													type="button"
													onClick={() => {
														setAssign(item);
														setAssignBox(false);
													}}
												>
													Assign
												</button>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
					<span className="checklist-head">
						Checklist (
						{checklist.filter((item) => item.isDone == true).length}
						/{listBox}) <span className="require">*</span>
					</span>
					<div className="checklist-box">
						{checklist?.map((el, idx) => {
							return (
								<div
									className="checklist-input-box"
									key={idx + "checklist-box"}
								>
									<span
										className="checklist-btn checklist-btn-l"
										onClick={() =>
											setChecklist(
												checklist.map((item, i) =>
													i === idx
														? {
																...item,
																isDone: !el.isDone,
														  }
														: item
												)
											)
										}
									>
										{!el.isDone ? (
											<img
												src={CheckBoxUnselect}
												alt="unchecked"
												className="model-checkbox"
											/>
										) : (
											<img
												src={CheckBoxSelect}
												alt="checked"
												className="model-checkbox"
											/>
										)}
									</span>
									<input
										className="model-input model-input-btn"
										type="text"
										name={`item-${idx + 1}`}
										placeholder="Add a task"
										value={el.name}
										onChange={(e) =>
											setChecklist(
												checklist.map((item, i) =>
													i === idx
														? {
																...item,
																name: e.target
																	.value,
														  }
														: item
												)
											)
										}
									/>
									<span
										className="checklist-btn checklist-btn-r"
										onClick={() =>
											handleDeleteChecklist(idx)
										}
									>
										<AiFillDelete cursor={"pointer"} />
									</span>
								</div>
							);
						})}
					</div>
					<span
						className="checklist-add"
						onClick={handleAddChecklist}
					>
						<AiOutlinePlus fontSize={16} />
						<span>Add New</span>
					</span>
				</div>
				<div className="model-btns">
					<label
						htmlFor="model-card-date"
						onClick={(e) =>
							document
								?.getElementById("model-card-date")
								?.showPicker()
						}
					>
						<button className="model-due-date" type="button">
							{dueDate ? simpleDate(dueDate) : "Select Due Date"}
						</button>
					</label>
					<input
						type="date"
						name="due-date"
						id="model-card-date"
						value={dueDate.split("T")[0]}
						onChange={(e) => {
							setDueDate(e.target?.value);
						}}
					/>
					<button
						type="button"
						className="model-cancel"
						onClick={() => {
							dispatch(setTaskCardM(false));
							dispatch(setTaskM(""));
						}}
					>
						Cancel
					</button>
					<button className="model-submit" type="submit">
						{load == "" ? "Save" : load}
					</button>
				</div>
			</form>
		</div>
	);
};
export const TaskCardPublic = () => {
	const { id } = useParams();
	const [task, setTask] = React.useState([]);
	useGetTask(id, setTask);

	return task?.length == 0 ? (
		<Loading />
	) : (
		<div className="model-container model-public">
			<Link to={"/"} className="nav-logo nav-logo-public">
				<PiCodesandboxLogoDuotone fontSize={22} />
				<span>Pro Manage</span>
			</Link>

			{task == null ? (
				<div className="model-box model-task-null">
					<h3>Task Not Found</h3>
					<p>
						The task you are looking for does not exist or has been
						deleted. Please check the URL and try again.
					</p>
					<Link to={"/"} className="model-btn">
						Back to Home
					</Link>
				</div>
			) : (
				<div className="model-box model-card">
					<div className="model-card-details">
						<div className="priority-box priority-public">
							<span
								className="priority-circel"
								style={{ background: "red" }}
							></span>
							<span>{task?.priority}</span>
						</div>
						<h3>{task?.title}</h3>
						<div className="checklist-head checklist-public">
							Checklist (
							{
								task?.checklist?.filter(
									(list) => list.isDone == true
								).length
							}
							/{task?.checklist?.length})
						</div>
						<div className="checklist-box checklist-box-public">
							{task?.checklist?.map((list, idx) => {
								return (
									<div
										className="checklist-input-box"
										key={idx + "checklist-box-public"}
									>
										<span className="checklist-btn checklist-btn-l">
											{!list.isDone ? (
												<img
													src={CheckBoxUnselect}
													alt="unchecked"
												/>
											) : (
												<img
													src={CheckBoxSelect}
													alt="checked"
												/>
											)}
										</span>
										<p className="model-input model-input-btn">
											{list.name}
										</p>
									</div>
								);
							})}
						</div>
					</div>
					<div className="model-due">
						{task?.dueDate && (
							<>
								<span>Due Date</span>
								<div>{getMonthDate(task?.dueDate)}</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
