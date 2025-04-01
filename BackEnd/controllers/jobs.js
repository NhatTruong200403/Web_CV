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
  UpdateJob: async function (id, jobData, user) {
    try {
      let job = await jobModel.findById(id).populate("companyId");
      console.log(job);
      if (!job) {
        throw new Error("Job not found.");
      }
      if(user._id.toString() !== job.companyId.userId.toString()){
        throw new Error("You can't update this job.");
      }
      job.updateAllowedFields(jobData);
      return await job.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteJob: async function (id, user) {
    try {
      let job = await jobModel.findById(id).populate("companyId");
      console.log(job);
      if (!job) {
        throw new Error("Job not found.");
      }
      if(user._id.toString() !== job.companyId.userId.toString()){
        throw new Error("You can't update this job.");
      }
      return await jobModel.findByIdAndUpdate(id, {
        isDeleted: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
