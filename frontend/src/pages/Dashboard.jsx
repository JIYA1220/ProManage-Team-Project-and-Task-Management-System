import Navbar from "./Navbar";
import Board from "./Board.jsx";
import Analytics from "./Analytics.jsx";
import Settings from "./Settings.jsx";
import ProjectsPage from "./ProjectsPage.jsx";
import ProjectDetailPage from "./ProjectDetailPage.jsx";
import { useSelector } from "react-redux";
import "../css/Dashboard.css";
import {
	AddedPeople,
	AddPeople,
	Logout,
	TaskCard,
	TaskDelete,
	UpdateCategory,
} from "../components/Model";
import { ProjectCardModal } from "../components/ProjectModel";

import { useLocation } from "react-router-dom";

const Dashboard = () => {
	const state = useSelector((store) => store.state);
    const { pathname } = useLocation();

    const renderSection = () => {
        if (pathname === "/projects") return <ProjectsPage />;
        if (pathname.startsWith("/projects/")) return <ProjectDetailPage />;
        
        if (state.dashboardSection == "board") return <Board />;
        if (state.dashboardSection == "analytics") return <Analytics />;
        if (state.dashboardSection == "settings") return <Settings />;
        return <Board />;
    };

	return (
		<>
			<Navbar />
            {renderSection()}
			{state.addPeopleM && <AddPeople />}
			{state.addedPeopleM && <AddedPeople />}
			{state.logoutM && <Logout />}
			{state.taskDeleteM && <TaskDelete />}
			{state.taskCardM && <TaskCard />}
			{state.updateCategoryM && <UpdateCategory />}
			{state.projectCardM && <ProjectCardModal />}
		</>
	);
};

export default Dashboard;
