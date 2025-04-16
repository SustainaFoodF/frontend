import axios from './axios';


const getLivreurTasks = async (livreurId, token) => {
    try {
        const response = await axios.get(`/livreur/${livreurId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

const getTaskById = async (taskId, token) => {
    try {
        const response = await axios.get(`/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
};

const updateTaskStatus = async (taskId, status, token) => {
    try {
        const response = await axios.post(`/${taskId}/status`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating task status:", error);
        throw error;
    }
};

const reportTaskIssue = async (taskId, issueData, token) => {
    try {
        const formData = new FormData();
        formData.append('type', issueData.type);
        formData.append('details', issueData.details);
        if (issueData.image) {
            formData.append('image', issueData.image);
        }

        const response = await axios.post(`/${taskId}/issue`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error reporting issue:", error);
        throw error;
    }
};

const taskService = {
    getLivreurTasks,
    getTaskById,
    updateTaskStatus,
    reportTaskIssue
};

export default taskService;

