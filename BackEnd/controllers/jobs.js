var jobModel = require("../schemas/jobs.js");
module.exports = {
  GetAllJobs: async function () {
    return await jobModel
      .find({ isDeleted: false })
      .populate({
        path: "companyId",
        populate: { path: "userId" },
      })
      .populate("jobApplyPositionId")
      .populate("jobType");
  },
  GetJobById: async function (id) {
    return await jobModel
      .findOne({
        _id: id,
      })
      .populate({
        path: "companyId",
        populate: { path: "userId" },
      })
      .populate("jobApplyPositionId")
      .populate("jobType");
  },
  CreateJob: async function (jobData) {
    try {
      let newJob = new jobModel(
        Object.assign({}, jobData, { status: jobData.status || "pending" })
      );
      return await newJob.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateJob: async function (id, jobData) {
    try {
      let job = await jobModel.findById(id);
      job.updateAllowedFields(jobData);
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteJob: async function (id) {
    try {
      return await jobModel.findByIdAndUpdate(id, {
        isDeleted: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
