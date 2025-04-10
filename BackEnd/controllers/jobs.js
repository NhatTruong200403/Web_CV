const UserModel = require("moongose/models/user_model.js");
var jobModel = require("../schemas/jobs.js");
var mongoose = require("mongoose");
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
      .find({
        companyId: companyid,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .populate("jobApplyPositionId")
      .populate("jobType");
  },
  GetAllJobApplies: async function (jobId, userId) {
    try {
      console.log(jobId, userId);
      let jobIDID = new mongoose.Types.ObjectId(jobId);
      const jobfind = await jobModel.findById(jobIDID).populate({
        path: "companyId",
        populate: { path: "userId" },
      });
      const job = await jobModel.findById(jobId).populate({
        path: "applicants",
      });
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
        _id: id,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
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
        throw new Error("Job not found");
      }
      let user = await UserModel.findOne(userId);
      if (user.cvFile == "") {
        throw new Error("User ch cập nhật CV");
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
      if (!job) {
        throw new Error("Job not found.");
      }
      return await jobModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
