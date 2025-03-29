let userModel = require("../schemas/user");
let roleModel = require("../schemas/role");
let company = require("../schemas/company");
let bcrypt = require("bcrypt");
module.exports = {
  GetAllUsers: async function () {
    return await userModel.find({
      status: false,
    });
  },
  GetUserByID: async function (id) {
    var user = await userModel.findById(id).populate({
      path: "role",
      select: "name",
    }).select("-password");
    if (user.role === "company") {
      const company = await company.findOne({ userId: user._id }).lean();
      user.company = company;
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
      let allowField = ["password", "email", "urlImg", "role"];
      for (const key of Object.keys(body)) {
        if (allowField.includes(key)) {
          user[key] = body[key];
        }
      }
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateRoleCompany: async function (id) {
    try {
      let user = await userModel.findById(id);
      user.role = "company";
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteAnUser: async function (id) {
    try {
      return await userModel.findByIdAndUpdate(id, {
        status: false,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CheckLogin: async function (username, password) {
    let user = await this.GetUserByUsername(username);
    console.log(username, password);
    if (!user) {
      throw new Error("Username hoc password khong dung");
    } else {
      console.log(password,"      ",user.password);
      if (bcrypt.compareSync(password, user.password)) {
        console.log(user._id);
        return user._id;
      } else {
        throw new Error("Username hoc password khong dung");
      }
    }
  },
  ChangePassword: async function (user, oldpassword, newpassword) {
    if (bcrypt.compareSync(oldpassword, user.password)) {
      user.password = newpassword;
      return await user.save();
    } else {
      throw new Error("oldpassword khong dung");
    }
  },
};



// https://api.vietqr.io/v2/business/{taxCode}
// nhập mã số thuế vào