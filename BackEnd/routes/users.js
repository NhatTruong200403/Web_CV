var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
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
  check_authorization(constants.USER_PERMISSION),
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
  // check_authentication, check_authorization(constants.USER_PERMISSION),
  upload.single("CV"),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return sendError(res, "No file uploaded", "SERVER_ERROR", 500);
      }
      let url = await uploadCV(req.file, "users");
      console.log(url);
      let user = await userController.UpdateCV(req.user._id, url);
      sendSuccess(res, url, "Update avatar user successfully", 200);
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
