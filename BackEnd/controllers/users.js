let userModel = require("../schemas/user");
let mongoose = require("mongoose");
let roleModel = require("../schemas/role");
let companyModel = require("../schemas/company");
let bcrypt = require("bcrypt");
const UserModel = require("moongose/models/user_model");
module.exports = {
  GetAllUsers: async function () {
    return await userModel.find({
      status: false,
    });
  },
  GetAllApplyById: async function (userId) {
    try {
      const user = await userModel
        .findById(userId)
        .populate({
          path: "appliJobs",
          populate: {
            path: "jobApplyPositionId",
            model: "Job",
            select: "_id title companyId jobApplyPositionId jobType",
          },
        });
        console.log("User: ",user);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetUserByID: async function (id) {
    var user = await userModel.findById(id).populate({
      path: "role",
      select: "name",
    }).select("-password").lean();;
    let role = await roleModel.findOne({
      name: "Company",
    });
    if (user.role._id.toString() === role._id.toString()) {
      const company = await companyModel.findOne({ userId: user._id }).lean();
      user.company = company || null;
    }
    return user;
  },
  GetUserByEmail: async function (email) {
    return await userModel
      .findOne({
        email: email,
      })
      .populate({
        path: "role",
        select: "name",
      }).select("-password");
  },
  GetUserByToken: async function (token) {
    return await userModel
      .findOne({
        resetPasswordToken: token,
      })
      .populate({
        path: "role",
        select: "name",
      }).select("-password");
  },
  GetUserByUsername: async function (username) {
    return await userModel
      .findOne({
        username: username,
      })
      .populate("role");
  },
  ApplyJob: async function (Id, userId) {
    try {
      const jobId = mongoose.Types.ObjectId(Id);
      console.log(userId)
      let user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('Khong tim thay user');
      }
      if(user.appliJobs && user.appliJobs.includes(jobId)){
        throw new Error('Ban da ung tuyen cong viec nay roi');
      }
      if(user.status === 'pending' && user.cvFile == "") {
        throw new Error('Ban chua upload CV');
      }
      if (!user.appliJobs) {
        user.appliJobs = [];
      }
      if (!user.appliJobs.includes(jobId)) {
        user = await userModel.findByIdAndUpdate(
          userId,
          {
            $push: { appliJobs: jobId },
          },
          { new: true }
        );
      }
  
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CreateAnUser: async function (username, password, email, rolename) {
    try {
      let role = await roleModel.findOne({
        name: rolename,
      });
      if (role) {
        let user = new userModel({
          username: username,
          password: password,
          email: email,
          role: role._id,
          avatarUrl: "https://res.cloudinary.com/dq7dbaqd3/image/upload/v1743252562/users/wevdajkoxqfqf8gev3zm.jpg",
          authProvider : "local",
          status: "User",
        });
        return await user.save();
      } else {
        throw new Error("Role khong ton tai");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateAnUser: async function (id, body) {
    try {
      let user = await userModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      user.updateAllowedFields(body);
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateAvatar: async function (id, url) {
    try {
      let user = await userModel.findById(id);
      user.avatarUrl = url;
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateCV: async function (id, url) {
    try {
      let user = await userModel.findById(id);
      user.cvFile = url;
      user.status = 'success';
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateRoleCompany: async function (id, rolename) {
    try {
      let role = await roleModel.findOne({
        name: rolename,
      });
      console.log("role._id",role._id);
      let user = await userModel.findById(id);
      console.log("user", user);
      user.role = role._id;
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteAnUser: async function (id) {
    try {
      return await userModel.findByIdAndUpdate(id, {
        isDeleted : true
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CheckLogin: async function (username, password) {
    let user = await this.GetUserByUsername(username);
    if (user.authProvider === "google") {
      throw new Error("Tài khoản này chỉ hỗ trợ đăng nhập qua Google");
    }
    if (!user) {
      throw new Error("Username hoac password khong dung");
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        return user._id;
      } else {
        throw new Error("Username hoac password khong dung");
      }
    }
  },
  ChangePassword: async function (user, oldpassword, newpassword) {
    if (bcrypt.compareSync(oldpassword, user.password)) {
      user.password = newpassword;
      return await user.save();
    } else {
      throw new Error("Old password khong dung");
    }
  },
};



// https://api.vietqr.io/v2/business/{taxCode}
// nhập mã số thuế vào