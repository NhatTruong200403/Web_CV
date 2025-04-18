var roleModel = require('../schemas/role')
module.exports = {
    GetAllRoles: async function(){
        return await roleModel.find({
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
          })
    },
    CreateRole:async function(name){
       try {
        let newRole = new roleModel({
            name:name
        })
        return await newRole.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
}