import api from "./api";
import { getErrorMessage } from "./authService";

// filters: { status, priority, search }
export const getTasks = async (filters = {}) => {
  try {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;

    const { data } = await api.get("/tasks", { params });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTask = async (taskData) => {
  try {
    const { data } = await api.post("/tasks", taskData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
