import getHeader from "../utils/header";
import { toast } from "react-toastify";
import {
	setCategoryName,
	setUpdateCategoryM,
    setLoading
} from "../redux/slices/stateSlice";
import {
	setBacklog,
	setTodo,
	setInProgress,
	setDone,
} from "../redux/slices/taskSlice";

const useUpdateCategory = (
	dispatch,
	taskId,
	newCategory,
    currentProjectId
) => {
	dispatch(setLoading(true));
	fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}/status`, {
		method: "PATCH",
		headers: getHeader(),
		body: JSON.stringify({
			category: newCategory,
		}),
	})
		.then((response) => response.json())
		.then((json) => {
			if (json?.message === "success") {
				toast.success("Status Updated");
                // RE-FETCH ALL TASKS TO ENSURE UI SYNC
                const url = currentProjectId 
                    ? `${import.meta.env.VITE_BACKEND_URL}/api/tasks?projectId=${currentProjectId}`
                    : `${import.meta.env.VITE_BACKEND_URL}/api/tasks/all`;
                
                fetch(url, { headers: getHeader() })
                    .then(res => res.json())
                    .then(taskJson => {
                        if (taskJson?.message === "success") {
                            dispatch(setBacklog(taskJson.data.backlog));
                            dispatch(setTodo(taskJson.data.todo));
                            dispatch(setInProgress(taskJson.data.inProgress));
                            dispatch(setDone(taskJson.data.done));
                        }
                        dispatch(setLoading(false));
                    });
			} else {
				toast.error(json?.message || "Failed to update status");
				dispatch(setLoading(false));
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			toast.error("Network error: check if backend is running");
			dispatch(setLoading(false));
		});
};

export default useUpdateCategory;
