var jobModel = require("../schemas/jobs.js");
module.exports = {
  GetAllJobs: async function () {
    return await jobModel
      .find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .populate({
        path: "companyId",
        populate: { path: "userId" },
      })
      .populate("jobApplyPositionId")
      .populate("jobType");
  },
  GetAllJobsByCompanyId: async function (companyid) {
    return await jobModel
      .find({ companyId: companyid, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .populate("jobApplyPositionId")
      .populate("jobType");
  },
  GetAllJobApplies: async function (jobId, userId) {
    try {
      const jobfind = await jobModel.findById(jobId).populate({
        path: "companyId",
        populate: { path: "userId" },
      });
      if(jobfind.companyId.userId._id.toString() !== userId.toString()){
        throw new Error("You don't have permission");
      }
      const job = await jobModel
        .findById(jobId)
        .populate({
          path: "applicants"
        })
        // .populate({
        //   path: "companyId",
        //   populate: { path: "userId" },
        // })
        // .populate("jobApplyPositionId")
        // .populate("jobType");
      if (!job) {
        throw new Error("Job not found");
      }
      return job;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetJobById: async function (id) {
    return await jobModel
      .findOne({
        _id: id,$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
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
  ApplyJob: async function (jobId, userId) {
    try {
      let job = await jobModel.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      if (!job.applicants.includes(userId)) {
        job = await jobModel.findByIdAndUpdate(
          jobId,
          {
            $push: { applicants: userId },
          },
          { new: true }
        );
      }
  
      return job;
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
