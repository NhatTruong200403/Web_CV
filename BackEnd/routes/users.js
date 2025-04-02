var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
var generatePdf = require("../cv-generator/generate_cv");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let { sendSuccess, sendError } = require("../utils/responseHandler");
let constants = require("../utils/constants");
const companies = require("../controllers/companies");
const { uploadImage, uploadCV } = require("../utils/file");
const upload = require("../config/multer");
/* GET users listing. */
router.get(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllUsers();
      sendSuccess(res, users, "Get info user successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
router.get("/cv", async function (req, res, next) {
  try {

      const pdfBuffer = await generatePdf.generatePdf();

      if (!pdfBuffer) {
           console.error("Hàm generatePdf không trả về buffer.");
           return sendError(res, "Không thể tạo file PDF", "PDF_GENERATION_FAILED", 500);
      }

      console.log("PDF Buffer đã được tạo, dung lượng:", pdfBuffer.length, "bytes");
      console.log("Bắt đầu upload lên cloud...");

      // --- SỬA ĐỔI CHÍNH Ở ĐÂY ---
      // Tạo đối tượng 'file' mà hàm uploadCV mong đợi
      const fileObjectForUpload = {
          buffer: pdfBuffer,       // Dữ liệu buffer
          mimetype: "application/pdf" // Kiểu MIME
      };
      const folderName = "CV"; // Tên thư mục bạn muốn

      // Gọi uploadCV với đối tượng và tên thư mục
      const url = await uploadCV(fileObjectForUpload, folderName);
      // --- KẾT THÚC SỬA ĐỔI ---

      console.log("Upload thành công, URL:", url);
      sendSuccess(res, { pdfUrl: url }, "Tạo và upload CV thành công", 200);

  } catch (error) {
      console.error("Lỗi trong route /cv:", error);
      sendError(res, error.message || "Lỗi máy chủ không xác định", "SERVER_ERROR", 500);
  }
});
router.get(
  "/applies",
  check_authentication,
  check_authorization(constants.USERR_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllApplyById(req.user._id);
      sendSuccess(res, users, "Get apply user successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
router.post("/", check_authentication, async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.CreateAnUser(
      body.username,
      body.password,
      body.email,
      body.role
    );
    sendSuccess(res, user, "Create user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.put("/:id", async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.UpdateAnUser(req.params.id, body);
    sendSuccess(res, user, "Update user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.post(
  "/upCompanies/:taxCode",
  check_authentication,
  upload.single("image"),
  async function (req, res, next) {
    try {
      console.log(req.params.taxCode);
      let taxCode = req.params.taxCode;
      let imageUrl = "";
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
      imageUrl = await uploadImage(req.file);
      let result = await companies.CreateCompany(
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
//test
router.post(
  "/uploadAvatar",
  check_authentication,
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
//test
router.post(
  "/uploadCV",
  check_authentication, 
  check_authorization(constants.USER_PERMISSION),
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
router.delete("/:id", async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.DeleteAnUser(req.params.id);
    CreateSuccessRes(res, user, "Delete user successfully", 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
