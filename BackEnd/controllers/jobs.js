var jobModel = require('../schemas/jobs.js')
module.exports = {
    GetAllJobs: async function(){
        return await jobModel.find({
            isDeleted:false
          }).populate("companyId").populate("userId");
    },
    GetJobById: async function(id){
            return await jobModel.findOne({
                _id:id
              }
            ).populate("companyId").populate("userId");
        },
    CreateJob: async function (jobData) {
        try {
        //   let newJob = new jobModel({
        //     title: jobData.title,
        //     companyId: jobData.companyId,
        //     detailId: jobData.detailId,
        //     positionId: jobData.positionId,
        //     descriptions: jobData.descriptions, // Nhận danh sách mô tả
        //     requirements: jobData.requirements, // Nhận danh sách yêu cầu
        //     location: jobData.location,
        //     degree: jobData.degree,
        //     salary: jobData.salary,
        //     jobType: jobData.jobType,
        //     status: jobData.status || "pending", // Mặc định là "pending"
        //   });
    
          let newJob = new jobModel(Object.assign({}, jobData, { status: jobData.status || "pending" }));
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
}