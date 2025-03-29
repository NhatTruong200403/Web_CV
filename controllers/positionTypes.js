var positionTypeModel = require('../schemas/position_Types.js')
module.exports = {
    GetAllpositionTypes: async function(){
        return await positionTypeModel.find({
            isDeleted:false
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