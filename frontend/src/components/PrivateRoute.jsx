import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const auth = useSelector((store) => store.auth);
    const token = localStorage.getItem("token");

	if (!auth && !token) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default PrivateRoute;
