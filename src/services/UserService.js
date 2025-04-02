import axios from "./custom-axios";

function login(userInfo) {
    return axios.post("/auth/login", userInfo)
}

function signup(userInfo) {
    return axios.post("/auth/signup", userInfo)
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

export { login, signup, upCompany }