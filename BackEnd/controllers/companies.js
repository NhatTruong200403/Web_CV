const { default: axios } = require("axios");
var companyModel = require("../schemas/company");
var userModel = require("../schemas/user");
const Users = require("./users");
const { sendError } = require("../utils/responseHandler");
module.exports = {
  GetAllCompany: async function () {
    return await companyModel.find({
      isDeleted: false,
    });
  },
  GetCompanyById: async function (id) {
    return await companyModel.findOne({
      _id: id,
    });
  },
  CreateCompany: async function (taxCode, body, imageUrl, userId) {
    try {
      let company = await this.CheckCompanyTaxCode(
        taxCode,
        body,
        imageUrl,
        userId
      );
      let newJob = new companyModel({
        userId: userId,
        companyName: company.name,
        internationalName: company.internationalName,
        shortName: company.shortName,
        taxCode: taxCode,
        address: company.address,
        websiteUrl: body.websiteUrl,
        description: body.description,
        imageUrl: imageUrl,
      });
      await Users.UpdateRoleCompany(userId, "Company");
      return await newJob.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CheckCompanyTaxCode: async function (taxCode) {
    const company = await axios.get(
      `https://api.vietqr.io/v2/business/${taxCode}`
    );
    var data = company.data;
    if (data.code == "00") {
      return data.data;
    }
    return sendError(res, "Tax code not found", "SERVER_ERROR", 500);
  },
  UpdateCompany: async function (id, taxCode, body ,imageUrl, userId) {
    try {
      let userIdCompany = await companyModel.findOne({ _id: id });
      if(userId.toString() !== userIdCompany.userId.toString()){
        return "You don't have permission";
      }
      let company = await this.CheckCompanyTaxCode(taxCode);
      let currentCompany = await companyModel.findById(id).lean();
      return await companyModel.findByIdAndUpdate(id, {
        companyName: company.name || currentCompany.companyName,
        internationalName:
          company.internationalName || currentCompany.internationalName,
        shortName: company.shortName || currentCompany.shortName,
        taxCode: taxCode || currentCompany.taxCode,
        address: company.address || currentCompany.address,
        websiteUrl: body.websiteUrl || currentCompany.websiteUrl,
        description: body.description || currentCompany.description,
        imageUrl: imageUrl || currentCompany.imageUrl,
      }, { new: true });
      
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
