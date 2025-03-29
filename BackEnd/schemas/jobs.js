const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PositionType",
      required: true,
    },
    details: [{
      type: String,
      required: true,
    }],
    benefits: [{
      type: String,
      required: true,
    }],
    descriptions: [
      {
        type: String,
        required: true,
      },
    ],
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    salary: {
      type: {
        min: { type: Number, required: false }, // Lương tối thiểu
        max: { type: Number, required: false }, // Lương tối đa
        fixed: { type: Number, required: false }, // Mức lương cố định
        negotiable: { type: Boolean, default: false }, // Thương lượng hay không
      },
      required: true,
    },
    jobType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobType",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
