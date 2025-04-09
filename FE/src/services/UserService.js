import axios from "./custom-axios";

function login(userInfo) {
    return axios.post("/auth/login", userInfo)
}

function signup(userInfo) {
    return axios.post("/auth/signup", userInfo)
}

function getMe() {
    return axios.get("/auth/me");
}

function getCompanyIdByUser() {
    return axios.get("/users/GetCompanyIdByUser")
}

function upCompany(taxCode, data) {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("websiteUrl", data.websiteUrl);
    if (data.image)
        formData.append("image", data.image);
    return axios.post(`/users/upCompanies/${taxCode}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

// PUT /users/:id
function updateUser(userId, userData) {
    return axios.put(`/users/${userId}`, userData);
}

// POST /users/uploadAvatar
function uploadAvatar(avatarFile) {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    return axios.post("/users/uploadAvatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

// POST /users/uploadCV
function uploadUserCV(cvFile) {
    const formData = new FormData();
    formData.append("CV", cvFile); // Match backend field name 'CV'
    return axios.post("/users/uploadCV", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

// GET /users/applies
function getUserApplies() {
    // Assuming backend uses logged-in user context
    return axios.get("/users/applies");
}

// GET /users/cv (Assuming this initiates generation and returns URL)
function generateAndUploadCV() {
    return axios.get("/users/cv");
}

// DELETE /users/:id (Assuming Admin only)
function deleteUser(userId) {
    return axios.delete(`/users/${userId}`);
}


export { login, signup, upCompany, getMe, getCompanyIdByUser, updateUser, uploadAvatar, uploadUserCV, getUserApplies, generateAndUploadCV, deleteUser }