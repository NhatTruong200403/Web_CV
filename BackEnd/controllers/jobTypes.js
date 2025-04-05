var jobTypeModel = require("../schemas/job_Types.js");
module.exports = {
  GetAllJobTypes: async function () {
    return await jobTypeModel.find({
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
  },
  GetJobTypeById: async function (is) {
    return await jobTypeModel.findOne({
      _id: is,$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
  },
  CreateJobType: async function (name) {
    try {
      let newJobType = new jobTypeModel({
        name: name,
      });
      return await newJobType.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
