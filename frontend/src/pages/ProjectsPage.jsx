import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setProjectCardM } from "../redux/slices/stateSlice";
import getHeader from "../utils/header";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";
import { AiOutlinePlus } from "react-icons/ai";

const ProjectsPage = () => {
    const [projects, setProjects] = React.useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    React.useEffect(() => {
        dispatch(setLoading(true));
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
            method: "GET",
            headers: getHeader(),
        })
            .then((res) => res.json())
            .then((json) => {
                dispatch(setLoading(false));
                if (Array.isArray(json)) {
                    setProjects(json);
                }
            })
            .catch((err) => {
                dispatch(setLoading(false));
                console.error(err);
            });
    }, [dispatch]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-user">
                    <h3>Projects</h3>
                </div>
                <div>
                    <h2>My Projects</h2>
                    <button 
                        className="model-submit" 
                        style={{ width: "auto", padding: "10px 20px" }}
                        onClick={() => dispatch(setProjectCardM(true))}
                    >
                        <AiOutlinePlus /> Create Project
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", paddingRight: "20px" }}>
                {projects.map((project) => (
                    <div key={project._id} className="column" style={{ height: "auto", minHeight: "200px", padding: "20px" }}>
                        <h3 style={{ marginBottom: "10px" }}>{project.title}</h3>
                        <p style={{ opacity: 0.7, fontSize: "14px", height: "60px", overflow: "hidden" }}>{project.description}</p>
                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "14px" }}>
                                <div><strong>Members:</strong> {project.members?.length || 0}</div>
                                <div><strong>Role:</strong> {project.owner?._id === auth._id ? "Owner" : "Member"}</div>
                            </div>
                            <button 
                                className="model-submit" 
                                style={{ width: "auto", padding: "5px 15px" }}
                                onClick={() => navigate(`/projects/${project._id}`)}
                            >
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "50px", opacity: 0.5 }}>
                    No projects found. Create one to get started!
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
