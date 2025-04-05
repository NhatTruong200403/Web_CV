import axios from "./custom-axios";

function getAllJobs() {
    return axios.get("jobs/")
}
function getJobById(id) {
    return axios.get(`jobs/${id}`)
}

export { getAllJobs, getJobById }