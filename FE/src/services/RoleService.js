// src/services/RoleService.js
import axios from "./custom-axios"; // Import instance axios đã cấu hình

const API_ENDPOINT = "/roles"; // Endpoint gốc cho roles

// Lấy tất cả roles
function getAllRoles() {
    return axios.get(API_ENDPOINT);
}

// Lấy role theo ID
function getRoleById(id) {
    return axios.get(`${API_ENDPOINT}/${id}`);
}

// Tạo mới role
// data chỉ cần chứa { name: "Tên Role Mới" }
function createRole(data) {
    return axios.post(API_ENDPOINT, data);
}

// Cập nhật role
// data chỉ cần chứa { name: "Tên Role Đã Cập Nhật" }
function updateRole(id, data) {
    return axios.put(`${API_ENDPOINT}/${id}`, data);
}

// Xóa role
function deleteRole(id) {
    return axios.delete(`${API_ENDPOINT}/${id}`);
}

export {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};