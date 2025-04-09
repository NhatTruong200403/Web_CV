var positionTypeModel = require('../schemas/position_Types.js');
const mongoose = require('mongoose');

module.exports = {
    GetAllpositionTypes: async function(){
        return await positionTypeModel.find({
             $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
           });
    },
    GetpositionTypeByID: async function(id){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid Position Type ID format');
        }
        return await positionTypeModel.findOne({
             _id:id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
           });
    },
    CreatepositionType:async function(name, description = ""){
           try {
            if (!name || name.trim() === "") {
                throw new Error('Position Type name is required');
            }
            let newPosition = new positionTypeModel({
                 name: name.trim(),
                 description: description
            });
            return await newPosition.save();
           } catch (error) {
             if (error.code === 11000) {
                 throw new Error('Position Type name already exists');
             }
             throw new Error(error.message);
           }
       },
    
    UpdatePositionType: async function(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid Position Type ID format');
            }
            const allowedUpdates = ['name', 'description'];
            const updates = {};
            for (const key in updateData) {
                if (allowedUpdates.includes(key)) {
                    updates[key] = key === 'name' && typeof updateData[key] === 'string'
                                     ? updateData[key].trim()
                                     : updateData[key];
                }
            }

            if (Object.keys(updates).length === 0) {
                throw new Error('No valid fields provided for update');
            }
            if (updates.name !== undefined && updates.name === "") {
                 throw new Error('Position Type name cannot be empty');
            }


            const updatedPositionType = await positionTypeModel.findOneAndUpdate(
                { _id: id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!updatedPositionType) {
                throw new Error('Position Type not found or already deleted');
            }
            return updatedPositionType;
        } catch (error) {
            if (error.code === 11000) {
                 throw new Error('Position Type name already exists');
             }
            throw new Error(error.message);
        }
    },

    DeletePositionType: async function(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid Position Type ID format');
            }
            const result = await positionTypeModel.updateOne(
                { _id: id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
                { $set: { isDeleted: true } }
            );

            if (result.matchedCount === 0) {
                 throw new Error('Position Type not found or already deleted');
            }
             if (result.modifiedCount === 0) {
                 console.warn(`Position Type with ID ${id} was found but not modified (perhaps already deleted).`);
             }


            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}