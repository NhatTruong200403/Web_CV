import axios from "./custom-axios";

function getAllPositionTypes() {
    return axios.get("positionTypes/")
}
function getPositionTypeById(id) {
    return axios.get(`positionTypes/${id}`)
}

export { getAllPositionTypes, getPositionTypeById }