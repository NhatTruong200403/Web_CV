const { default: axios } = require("axios");
var companyModel = require("../schemas/company");
var userModel = require("../schemas/user");
const Users = require("./users");
const { uploadImage, uploadCV } = require("../utils/file");
const { sendError } = require("../utils/responseHandler");
module.exports = {
  GetAllCompany: async function () {
    return await companyModel.find({
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
  },
  GetByUser: async function (userId) {
    return await companyModel.findOne({
      userId: userId,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
  },
  GetCompanyById: async function (id) {
    return await companyModel.findOne({
      _id: id,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });
  },
  CreateCompany: async function (req) {
    try {
      let company = await this.CheckCompanyTaxCode(
        req.params.taxCode,
      );
      let imageUrl = await uploadImage(req.file);
      let newJob = new companyModel({
        userId: userId,
        companyName: company.name || "",
        internationalName: company.internationalName || "",
        shortName: company.shortName || "",
        taxCode: req.params.taxCode,
        address: company.address || "",
        websiteUrl: req.body.websiteUrl,
        description: req.body.description,
        imageUrl: imageUrl,
      });
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
