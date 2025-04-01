import axios from "./custom-axios";

function geAllJobs() {
    return axios.get("jobs/")
}

export { geAllJobs }