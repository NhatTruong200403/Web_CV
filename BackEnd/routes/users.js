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

// // --- Route xử lý tạo CV (POST /cv) ---
// router.post(
//   "/cv",
//   Authentication,
//   upload.single("profileImage"), // Middleware xử lý ảnh trước
//   async (req, next, res) => { // Bỏ `next` nếu không dùng đến
//     let cvData;
//     let imageUrl = null;
//     let pdfUrl = null;
//     console.log("post CV:",req.body.cvDataField);
//     try {
//       // --- 1. Parse CV Data ---
//       if (!req.body.cvDataField) {
//         return sendError(res, "Thiếu dữ liệu cvDataField", "MISSING_DATA", 400);
//       }
//       try {
//         cvData = JSON.parse(req.body.cvDataField);
//       } catch (e) {
//         console.error("Lỗi parse cvData:", e);
//         return sendError(res, "Dữ liệu cvData không hợp lệ", "INVALID_DATA", 400);
//       }

//       // --- 2. Upload Ảnh (nếu có) ---
//       if (req.file) {
//         console.log(`Đã nhận ảnh: ${req.file.originalname} (${req.file.size} bytes)`);
//         try {
//           const imageFileObject = { buffer: req.file.buffer, mimetype: req.file.mimetype };
//           // Song song hóa việc upload ảnh và tạo PDF nếu generatePdf không cần imageUrl ngay lập tức
//           // Hoặc tuần tự nếu generatePdf cần imageUrl
//           imageUrl = await uploadImage(imageFileObject, "profile_images");
//           console.log("Upload ảnh thành công, URL:", imageUrl);
//           // Gán URL ảnh vào cvData để sử dụng trong PDF
//           cvData.personalInfo = { ...cvData.personalInfo, profileImageUrl: imageUrl };
//         } catch (uploadImageError) {
//           console.error("Lỗi upload ảnh (bỏ qua):", uploadImageError);
//           // Không return lỗi, tiếp tục tạo CV không có ảnh
//         }
//       }

//       // --- 3. Tạo và Upload PDF ---
//       // Đảm bảo generatePdf đã được sửa để nhận cvData
//       const pdfBuffer = await generatePdf.generatePdf(cvData);
//       if (!pdfBuffer) {
//          // Throw error để bắt trong catch block chính
//         throw new Error("Không thể tạo file PDF (buffer trống)");
//       }
//       console.log("PDF Buffer đã tạo:", pdfBuffer.length, "bytes");

//       const pdfFileObject = { buffer: pdfBuffer, mimetype: "application/pdf" };
//       pdfUrl = await uploadCV(pdfFileObject, "CV"); // Upload PDF
//       console.log("Upload PDF thành công, URL:", pdfUrl);

//       sendSuccess(res, "ok", "Tạo và upload CV thành công", 201);

//     } catch (error) {
//       // --- Xử lý lỗi tập trung ---
//       console.error("Lỗi trong tiến trình tạo CV:", error);

//       // Lỗi cụ thể từ các bước trước đó
//       if (error.message === "Không thể tạo file PDF (buffer trống)") {
//         return sendError(res, "Không thể tạo file PDF", "PDF_GENERATION_FAILED", 500);
//       }
//       // Lỗi từ multer (file không hợp lệ) đã được đưa vào đây qua Error
//       if (error.message === "Chỉ cho phép upload file ảnh!") {
//          return sendError(res, error.message, "INVALID_FILE_TYPE", 400);
//       }
//       if (error instanceof multer.MulterError) {
//          return sendError(res, error.message, "UPLOAD_ERROR", 400); // Lỗi khác từ multer
//       }

//       // Lỗi chung
//       sendError(res, error.message || "Lỗi máy chủ không xác định", "SERVER_ERROR", 500);
//     }
//   }
// );




router.get("/cv", Authentication, async function (req, res, next) {
  // <--- Thêm Authentication
  try {
    // Lấy thông tin người dùng từ middleware Authentication
    const userId = req.user?._id; // <--- Lấy userId
    if (!userId) {
      // Nếu không có userId (lỗi Authentication?), trả về lỗi
      return sendError(
        res,
        "Không xác thực được người dùng",
        "UNAUTHENTICATED",
        401
      );
    }

    const pdfBuffer = await generatePdf.generatePdf();
    if (!pdfBuffer) {
      console.error("Hàm generatePdf không trả về buffer.");
      return sendError(
        res,
        "Không thể tạo file PDF",
        "PDF_GENERATION_FAILED",
        500
      );
    }

    const fileObjectForUpload = {
      buffer: pdfBuffer,
      mimetype: "application/pdf",
    };

    const url = await uploadCV(fileObjectForUpload, "CV");
    console.log("Upload thành công, URL:", url);

    // ===>>> THÊM BƯỚC CẬP NHẬT DATABASE Ở ĐÂY <<<===
    if (url) {
      try {
        // Gọi controller để cập nhật trường cvFile trong DB cho user hiện tại
        await userController.UpdateCV(userId, url); // <--- Gọi hàm cập nhật CV
        console.log(`Đã cập nhật CV URL cho user ${userId} vào database.`);
      } catch (updateError) {
        // Ghi log lỗi cập nhật DB nhưng vẫn có thể trả về URL cho client
        console.error(
          `Lỗi khi cập nhật CV URL vào database cho user ${userId}:`,
          updateError
        );
        // Tùy chọn: Có thể trả về lỗi ở đây nếu việc cập nhật DB là bắt buộc
        // return sendError(res, "Lỗi khi lưu URL CV vào hồ sơ", "DB_UPDATE_FAILED", 500);
      }
    }
    // ===>>> KẾT THÚC BƯỚC CẬP NHẬT <<<===

    // Vẫn trả về URL thành công cho client
    sendSuccess(res, { pdfUrl: url }, "Tạo và upload CV thành công", 200);
  } catch (error) {
    console.error("Lỗi trong route /cv:", error);
    sendError(
      res,
      error.message || "Lỗi máy chủ không xác định",
      "SERVER_ERROR",
      500
    );
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
router.delete("/:id", async function (req, res, next) {
  try {
    let body = req.body;
    let user = await userController.DeleteAnUser(req.params.id);
    sendSuccess(res, user, "Delete user successfully", 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
