import axios from "./custom-axios";

function getAllPositionTypes() {
    return axios.get("positionTypes/")
}

function getPositionTypeById(id) {
    return axios.get(`positionTypes/${id}`)
}

function createPositionType(data) {
    return axios.post("positionTypes/", data);
}

function updatePositionType(id, data) {
    return axios.put(`positionTypes/${id}`, data);
}

function deletePositionType(id) {
    return axios.delete(`positionTypes/${id}`);
}

export {
    getAllPositionTypes,
    getPositionTypeById,
    createPositionType,
    updatePositionType,
    deletePositionType
};