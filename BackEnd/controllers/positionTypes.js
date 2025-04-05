var positionTypeModel = require('../schemas/position_Types.js')
module.exports = {
    GetAllpositionTypes: async function(){
        return await positionTypeModel.find({
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
          })
    },
    GetpositionTypeByID: async function(id){
        return await positionTypeModel.findOne({
            _id:id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
          })
    },
    CreatepositionType:async function(name){
           try {
            let newPosition = new positionTypeModel({
                name:name
            })
            return await newPosition.save()
           } catch (error) {
            throw new Error(error.message)
           }
        }
}