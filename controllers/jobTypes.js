var jobTypeModel = require('../schemas/job_Types.js')
module.exports = {
    GetAllJobTypes: async function(){
        return await jobTypeModel.find({
            isDeleted:false
          })
    },
    CreateJobType:async function(name){
           try {
            let newJobType = new jobTypeModel({
                name:name
            })
            return await newJobType.save()
           } catch (error) {
            throw new Error(error.message)
           }
        }
}