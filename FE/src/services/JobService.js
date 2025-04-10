import axios from "./custom-axios";

function getAllJobs() {
    return axios.get("jobs/")
}
function getJobById(id) {
    return axios.get(`jobs/${id}`)
}

function createJob(data) {
    return axios.post("jobs/", data)
}

function updateJobInfo(id, data) {
    return axios.put(`jobs/${id}`, data)
}

function deletePost(id) {
    return axios.delete(`jobs/${id}`)
}

function applyJob(jobId) {
    return axios.post(`jobs/apply/${jobId}`);
}

export { getAllJobs, getJobById, createJob, updateJobInfo, deletePost , applyJob }