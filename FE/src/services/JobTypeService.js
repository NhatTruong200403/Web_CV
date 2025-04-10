// src/services/JobTypeService.js
import axios from "./custom-axios";

const API_ENDPOINT = "/jobTypes";

function getAllJobTypes() {
    return axios.get(API_ENDPOINT);
}

function getJobTypeById(id) {
    return axios.get(`${API_ENDPOINT}/${id}`);
}

// data: { name: "...", description: "..." }
function createJobType(data) {
    return axios.post(API_ENDPOINT, data);
}

// --- Thêm hàm update ---
// data: { name: "...", description: "..." }
function updateJobType(id, data) {
    return axios.put(`${API_ENDPOINT}/${id}`, data);
}

// --- Thêm hàm delete ---
function deleteJobType(id) {
    return axios.delete(`${API_ENDPOINT}/${id}`);
}

export {
    getAllJobTypes,
    getJobTypeById,
    createJobType,
    updateJobType, // Export hàm mới
    deleteJobType  // Export hàm mới
};