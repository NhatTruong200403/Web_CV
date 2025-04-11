var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
var generatePdf = require("../cv-generator/generate_cv");
let { Authentication, Authorizetion } = require("../utils/check_auth");
let { sendSuccess, sendError } = require("../utils/responseHandler");
let constants = require("../utils/constants");
const companies = require("../controllers/companies");
const users = require("../controllers/users");
const { uploadImage, uploadCV } = require("../utils/file");
const upload = require("../config/multer");
const multer = require("multer");
/* GET users listing. */

// Lấy tất cả user của Admin
router.get(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllUsers();
      sendSuccess(res, users, "Get info user successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// Lấy company bởi user
router.get(
  "/GetCompanyIdByUser",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  async function (req, res, next) {
    try {
      let company = await companies.GetByUser(req.user._id);
      sendSuccess(res, company, "Get company successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);


router.post("/cvFast", Authentication, async (req, res) => {
  let cvData;
  let pdfUrl = null;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendError(res, "Thiếu dữ liệu CV", "MISSING_DATA", 400);
    }

    cvData = req.body;
    if(!req.user.avatarUrl) {
      return sendError(res, "Chưa cập nhật ảnh đại diện", "MISSING_DATA", 400);
    }
    let imageUrl = req.user?.avatarUrl || null;
    cvData.personalInfo = { ...cvData.personalInfo, profileImageUrl: imageUrl };

    const pdfBuffer = await generatePdf.generatePdf(cvData);
    if (!pdfBuffer) {
      throw new Error("Không thể tạo file PDF (buffer trống)");
    }

    const pdfFileObject = { buffer: pdfBuffer, mimetype: "application/pdf" };
    pdfUrl = await uploadCV(pdfFileObject, "CV");
    let user = await userController.UpdateCV(req.user._id, pdfUrl);
    sendSuccess(res, user, "Tạo và upload CV thành công", 201);

  } catch (error) {
    console.error("Lỗi trong tiến trình tạo CV:", error);
    sendError(res, error.message || "Lỗi máy chủ không xác định", "SERVER_ERROR", 500);
  }
});

// Lấy tất cả các job mà userId đã apply
router.get(
  "/applies",
  Authentication,
  Authorizetion(constants.USERR_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllApplyById(req.user._id);
      sendSuccess(res, users, "Get apply user successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// Cập nhật thông tin user
router.put("/:id", async function (req, res, next) {
  try {
    let user = await userController.UpdateAnUser(req.params.id, req.body);
    sendSuccess(res, user, "Update user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
// Up role lên company
router.post(
  "/upCompanies/:taxCode",
  Authentication,
  upload.single("image"),
  async function (req, res, next) {
    try {
      console.log(req.file);
      if (
        !req.file ||
        !req.body.description?.trim() ||
        !req.body.websiteUrl?.trim()
      ) {
        return sendError(
          res,
          "Missing file or description or website URL ",
          "SERVER_ERROR",
          500
        );
      }
      console.log("UserId",req.user._id);
      let result = await companies.CreateCompany(req);
      await users.UpdateRoleCompany(req.user._id, "Company");
      sendSuccess(res, result, "Update company successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// Cập nhật avatar
router.post(
  "/uploadAvatar",
  Authentication,
  upload.single("avatar"),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return sendError(res, "No file uploaded", "SERVER_ERROR", 500);
      }
      let url = await uploadImage(req.file, "users");
      let user = await userController.UpdateAvatar(req.user._id, url);
      sendSuccess(res, user, "Update avatar user successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);
// Cập nhật CV
router.post(
  "/uploadCV",
  Authentication,
  Authorizetion(constants.USER_PERMISSION),
  upload.single("CV"),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return sendError(res, "No file uploaded", "SERVER_ERROR", 500);
      }
      let url = await uploadCV(req.file, "users");
      let user = await userController.UpdateCV(req.user._id, url);
      sendSuccess(res, user, "Update avatar user successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);
// Xóa tk
router.delete("/:id", Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.DeleteAnUser(req.params.id);
    sendSuccess(res, user, "Delete user successfully", 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
