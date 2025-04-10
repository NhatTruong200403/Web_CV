const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    jobApplyPositionId: { type: mongoose.Schema.Types.ObjectId, ref: "PositionType", required: true },
    jobType: { type: mongoose.Schema.Types.ObjectId, ref: "JobType", required: true },
    details: [{ type: String, required: true }],
    benefits: [{ type: String, required: true }],
    descriptions: [{ type: String, required: true }],
    requirements: [{ type: String, required: true }],
    location: { type: String, required: true, trim: true },
    degree: { type: String, trim: true },
    salary: {
      type: {
        min: { type: Number, required: false },
        max: { type: Number, required: false },
        fixed: { type: Number, required: false },
        negotiable: { type: Boolean, default: false },
      },
      required: true,
    },
    // Thêm trường ứng viên (applicants)
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


    status: { type: String, enum: ["pending", "approved", "closed"], default: "pending" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔥 Danh sách các trường cho phép cập nhật
const allowFields = [
  "title", "jobApplyPositionId", "details", "benefits",
  "descriptions", "requirements", "location", "degree", "salary", "jobType", "status"
];

// 🔥 Hàm cập nhật chỉ các trường được phép
jobSchema.methods.updateAllowedFields = function (newData) {
  for (let field of allowFields) {
    if (newData[field] !== undefined) {
      this[field] = newData[field];
    }
  }
};

jobSchema.methods.applyForJob = async function(userId) {
  if (!this.applicants.includes(userId)) {
    this.applicants.push(userId);
    await this.save();
  }
};

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
