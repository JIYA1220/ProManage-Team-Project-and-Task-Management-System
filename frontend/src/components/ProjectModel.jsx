import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setProjectCardM, setLoading } from "../redux/slices/stateSlice";
import getHeader from "../utils/header";
import { toast } from "react-toastify";
import "../css/Model.css";

export const ProjectCardModal = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [load, setLoad] = useState(false);

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!title) {
            return toast.error("Title is required");
        }
        setLoad(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
            method: "POST",
            headers: getHeader(),
            body: JSON.stringify({ title, description }),
        })
            .then((res) => res.json())
            .then((json) => {
                setLoad(false);
                if (json?._id) {
                    toast.success("Project created successfully");
                    dispatch(setProjectCardM(false));
                    // Refresh projects list - would be better via redux but following existing pattern
                    window.location.reload(); 
                } else {
                    toast.error(json.message || "Failed to create project");
                }
            })
            .catch((err) => {
                setLoad(false);
                toast.error("Something went wrong");
            });
    };

    return (
        <div className="model-container">
            <form className="model-box" onSubmit={handleCreateProject}>
                <h3>Create New Project</h3>
                <input
                    type="text"
                    placeholder="Project Title *"
                    className="model-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Project Description"
                    className="model-input"
                    style={{ height: "100px", paddingTop: "10px" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="model-btns">
                    <button
                        type="button"
                        className="model-cancel"
                        onClick={() => dispatch(setProjectCardM(false))}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="model-submit">
                        {load ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const AddMemberModal = ({ projectId, onMemberAdded }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [load, setLoad] = useState(false);

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!email) return toast.error("Email is required");
        
        setLoad(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${projectId}/members`, {
            method: "POST",
            headers: getHeader(),
            body: JSON.stringify({ email, role }),
        })
            .then((res) => res.json())
            .then((json) => {
                setLoad(true);
                if (json?._id) {
                    toast.success("Member added successfully");
                    onMemberAdded();
                } else {
                    toast.error(json.message || "Failed to add member");
                }
            })
            .catch((err) => {
                setLoad(false);
                toast.error("Something went wrong");
            });
    };

    return (
        <div className="model-container">
            <form className="model-box" onSubmit={handleAddMember}>
                <h3>Add Member to Project</h3>
                <input
                    type="email"
                    placeholder="User Email *"
                    className="model-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <select 
                    className="model-input" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={{ height: "45px" }}
                >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>
                <div className="model-btns">
                    <button
                        type="button"
                        className="model-cancel"
                        onClick={() => onMemberAdded()} // reuse close logic
                    >
                        Cancel
                    </button>
                    <button type="submit" className="model-submit">
                        {load ? "Adding..." : "Add Member"}
                    </button>
                </div>
            </form>
        </div>
    );
};
