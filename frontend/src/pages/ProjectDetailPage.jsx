import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Backlog from "./Backlog";
import ToDo from "./ToDo";
import InProgress from "./InProgress";
import Done from "./Done";
import { VscCollapseAll } from "react-icons/vsc";
import { AiOutlinePlus } from "react-icons/ai";
import { LuUsers2 } from "react-icons/lu";
import "../css/Task.css";
import { setTaskCardM, setLoading, setCurrentProjectId } from "../redux/slices/stateSlice";
import useAllTask from "../hooks/useAllTask";
import getHeader from "../utils/header";
import { AddMemberModal } from "../components/ProjectModel";
import Loading from "../components/Loading";

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [backlogCollapse, setBacklogCollapse] = useState(false);
    const [todoCollapse, setTodoCollapse] = useState(false);
    const [progressCollapse, setProgressCollapse] = useState(false);
    const [doneCollapse, setDoneCollapse] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    
    const auth = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setCurrentProjectId(id));
        dispatch(setLoading(true));
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`, {
            method: "GET",
            headers: getHeader(),
        })
            .then((res) => res.json())
            .then((json) => {
                dispatch(setLoading(false));
                if (json?.project) {
                    setProject(json.project);
                }
            })
            .catch((err) => {
                dispatch(setLoading(false));
                console.error(err);
            });
    }, [id, dispatch]);

    useAllTask(id);

    if (!project) return <Loading />;

    const isAdmin = project.owner._id === auth._id || 
                    project.members.some(m => m.user._id === auth._id && m.role === "admin");

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-user">
                    <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/projects")}>Back to Projects</h3>
                    <h3>{project.title}</h3>
                </div>
                <div className="header-board">
                    <div>
                        <h2>Board</h2>
                        {isAdmin && (
                            <span
                                className="add-people"
                                onClick={() => setShowAddMember(true)}
                            >
                                <LuUsers2 />
                                <span>Add Member</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="dashboard-column">
				<div className="column">
					<h4>
						<span>Backlog</span>{" "}
						<VscCollapseAll
							fontSize={18}
							cursor={"pointer"}
							onClick={() => setBacklogCollapse(!backlogCollapse)}
						/>
					</h4>
					<Backlog backlogCollapse={backlogCollapse} />
				</div>
				<div className="column">
					<h4>
						<span>To Do</span>
						<span>
							{isAdmin && (
                                <AiOutlinePlus
                                    fontSize={18}
                                    cursor={"pointer"}
                                    onClick={() => dispatch(setTaskCardM(true))}
                                />
                            )}
							<VscCollapseAll
								fontSize={18}
								cursor={"pointer"}
								onClick={() => setTodoCollapse(!todoCollapse)}
							/>
						</span>
					</h4>
					<ToDo todoCollapse={todoCollapse} />
				</div>
				<div className="column">
					<h4>
						<span>In Progress</span>{" "}
						<VscCollapseAll
							fontSize={18}
							cursor={"pointer"}
							onClick={() =>
								setProgressCollapse(!progressCollapse)
							}
						/>
					</h4>
					<InProgress progressCollapse={progressCollapse} />
				</div>
				<div className="column">
					<h4>
						<span>Done</span>{" "}
						<VscCollapseAll
							fontSize={18}
							cursor={"pointer"}
							onClick={() => setDoneCollapse(!doneCollapse)}
						/>
					</h4>
					<Done doneCollapse={doneCollapse} />
				</div>
			</div>

            {showAddMember && (
                <AddMemberModal 
                    projectId={id} 
                    onMemberAdded={() => setShowAddMember(false)} 
                />
            )}
        </div>
    );
};

export default ProjectDetailPage;
