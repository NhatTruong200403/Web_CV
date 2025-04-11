import axios from "./custom-axios";

function getAllJobsByCompanyId(id) {
    return axios.get(`companies/jobs/${id}`)
}

function getJobApplicants(jobId) {
    return axios.get(`jobs/apply/${jobId}`); 
}

export { getAllJobsByCompanyId, getJobApplicants }