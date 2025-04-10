const RoleModel = require('../schemas/role');
const UserModel = require('../schemas/user');

module.exports = {

  GetAllRoles: async function () {
    try {
      // Thêm điều kiện lọc isDeleted nếu bạn sử dụng soft delete cho roles
      return await RoleModel.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
    } catch (error) {
      console.error("Error in GetAllRoles:", error);
      throw new Error(`Could not fetch roles: ${error.message}`);
    }
  },
  GetRoleById: async function (id) {
    try {
      const role = await RoleModel.findOne({ _id: id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });
      return role;
    } catch (error) {
      console.error(`Error in GetRoleById for ID ${id}:`, error);
      if (error.name === 'CastError') {
        return null;
      }
      throw new Error(`Could not fetch role with ID ${id}: ${error.message}`);
    }
  },
  CreateRole: async function (roleName,description) {
    try {
      const existingRole = await RoleModel.findOne({ name: { $regex: new RegExp(`^${roleName}$`, 'i') } });
      if (existingRole) {
        throw new Error(`Role with name '${roleName}' already exists.`);
      }
      const newRole = new RoleModel({ name: roleName, description: description });
      return await newRole.save();
    } catch (error) {
      console.error("Error in CreateRole:", error);
      throw error;
    }
  },
  UpdateRole: async function (id, newName) {
    try {
      const roleToUpdate = await RoleModel.findById(id);
      if (!roleToUpdate) {
        throw new Error(`Role with ID ${id} not found.`);
      }

      const existingRoleWithNewName = await RoleModel.findOne({
        name: { $regex: new RegExp(`^${newName}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingRoleWithNewName) {
        throw new Error(`Another role with name '${newName}' already exists.`);
      }

      roleToUpdate.name = newName;

      return await roleToUpdate.save();
    } catch (error) {
      console.error(`Error in UpdateRole for ID ${id}:`, error);
      throw error;
    }
  },

  DeleteRole: async function (id) {
    try {
       const usersWithRole = await UserModel.countDocuments({ role: id });
       if (usersWithRole > 0) {
         throw new Error(`Cannot delete role with ID ${id} because it is currently assigned to ${usersWithRole} user(s).`);
       }
      const result = await RoleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      if (!result) {
         throw new Error(`Role with ID ${id} not found for deletion.`);
      }
      return result;


    } catch (error) {
      console.error(`Error in DeleteRole for ID ${id}:`, error);
       throw error;
    }
  },
};