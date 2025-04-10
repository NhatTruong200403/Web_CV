var express = require("express");
var router = express.Router();
var companyController = require("../controllers/companies");
var jobController = require("../controllers/jobs");
const { uploadImage } = require("../utils/file");
let { sendError, sendSuccess } = require("../utils/responseHandler");
const upload = require("../config/multer");
let constants = require("../utils/constants");
const { Authentication, Authorizetion } = require("../utils/check_auth");
const user = require("../schemas/user");

// Lấy tất cả company
router.get("/", async function (req, res, next) {
  let companies = await companyController.GetAllCompany();
  sendSuccess(res, companies, "Get all companies successfully", 200);
});
// Lấy comoany theo Id
router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let company = await companyController.GetCompanyById(id);
  sendSuccess(res, company, "Get company successfully", 200);
});
// Lấy tất cả job bởi company
router.get("/jobs/:id", async function (req, res, next) {
  let id = req.params.id;
  let company = await jobController.GetAllJobsByCompanyId(id);
  console.log(company);
  sendSuccess(res, company, "Get all job by company successfully", 200);
});
// Sửa company
router.put(
  "/:id/:taxCode",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  upload.single("image"),
  async function (req, res, next) {
    try {
      console.log(req.params);
      let { id, taxCode } = req.params;
      let imageUrl = "";
      if (req.file) {
        imageUrl = await uploadImage(req.file);
      }
      let result = await companyController.UpdateCompany(
        id,
        taxCode,
        req.body,
        imageUrl,
        req.user._id
      );
      sendSuccess(res, result, "Update company successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// router.delete('/:id',Authentication, async function (req, res, next) {
//     try {
//       let body = req.body
//       let company = await companyController.DeleteCompany(req.params.id, req.user._id);
//       CreateSuccessRes(res, user, 200);
//     } catch (error) {
//       next(error)
//     }
//   });

module.exports = router;
