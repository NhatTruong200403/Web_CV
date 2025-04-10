import axios from "./custom-axios";

function getAllJobsByCompanyId(id) {
    return axios.get(`companies/jobs/${id}`)
}

export { getAllJobsByCompanyId }