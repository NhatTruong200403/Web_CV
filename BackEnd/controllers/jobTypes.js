// controllers/jobTypes.js
const mongoose = require('mongoose'); // <--- THÊM DÒNG NÀY
const JobType = require('../schemas/job_Types'); // Đảm bảo đường dẫn này đúng

// --- Các hàm đã có ---
const GetAllJobTypes = async () => {
    return await JobType.find({}).sort({ name: 1 });
};

const GetJobTypeById = async (id) => {
    // Giờ đây mongoose đã được định nghĩa
    if (!mongoose.Types.ObjectId.isValid(id)) {
         throw new Error("Invalid Job Type ID format"); // Sửa message lỗi cho rõ hơn
    }
    return await JobType.findById(id);
};

const CreateJobType = async (name, description = '') => {
    if (!name || name.trim() === "") {
        throw new Error("Job Type name is required");
    }
    const existing = await JobType.findOne({ name: name.trim() });
    if (existing) {
        const error = new Error("Job Type name already exists");
        error.code = 11000;
        throw error;
    }
    const newJobType = new JobType({ name: name.trim(), description });
    return await newJobType.save();
};

const UpdateJobType = async (id, data) => {
     // Giờ đây mongoose đã được định nghĩa
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid Job Type ID format"); // Sửa message lỗi
    }
    if (!data || !data.name || data.name.trim() === "") {
        throw new Error("Job Type name is required for update");
    }
     const existing = await JobType.findOne({ name: data.name.trim(), _id: { $ne: id } });
     if (existing) {
         const error = new Error("Job Type name already exists");
         error.code = 11000;
         throw error;
     }
    const updateData = {
        name: data.name.trim(),
        description: data.description || ''
    };
    const updatedJobType = await JobType.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedJobType) {
         return null;
    }
    return updatedJobType;
};

const DeleteJobType = async (id) => {
     console.log(`Attempting to delete JobType with ID: ${id}`); // Giữ lại log debug
     // Giờ đây mongoose đã được định nghĩa
     if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid ID format received:", id);
        throw new Error("Invalid Job Type ID format"); // Sửa message lỗi
    }

    try { // Giữ lại try...catch bên trong nếu muốn debug thêm
        console.log("Calling JobType.findByIdAndDelete...");
        const result = await JobType.findByIdAndDelete(id);
        console.log("Result from findByIdAndDelete:", result);
        if (!result) {
             console.log(`JobType with ID ${id} not found for deletion.`);
             return null;
        }
        console.log(`Successfully deleted JobType with ID: ${id}`);
        return result;
    } catch (dbError) {
        console.error("Database error during JobType deletion:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
    }
};

module.exports = {
    GetAllJobTypes,
    GetJobTypeById,
    CreateJobType,
    UpdateJobType,
    DeleteJobType
};