var jobModel = require('../schemas/jobs.js')
module.exports = {
    GetAllJobs: async function(){
        return await jobModel.find({
            isDeleted:false
          })
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
}