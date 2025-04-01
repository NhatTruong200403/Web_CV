import axios from "./custom-axios";

function login(userInfo) {
    return axios.post("/auth/login", userInfo)
}

function signUp(userInfo) {
    return axios.post("/auth/signup", userInfo)
}

export { login, signUp }