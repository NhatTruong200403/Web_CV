var express = require("express");
var router = express.Router();
var jobsController = require("../controllers/jobs");
var userController = require("../controllers/users");
let { sendError, sendSuccess } = require("../utils/responseHandler");
let constants = require("../utils/constants");
const { Authentication, Authorizetion } = require("../utils/check_auth");

// Lấy tất cả các job
router.get("/", async function (req, res, next) {
  try {
    let job = await jobsController.GetAllJobs();
    sendSuccess(res, job, "Get all jobs successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
// Lấy job theo id
router.get("/:id", async function (req, res, next) {
  try {
    let job = await jobsController.GetJobById(req.params.id);
    sendSuccess(res, job, "Get job successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
// Lấy tất cả các apply của company
router.get(
  "/apply/:id",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  async function (req, res, next) {
    try {
      console.log(req.user._id);
      let job = await jobsController.GetAllJobApplies(req.params.id, req.user._id);
      sendSuccess(res, job, "Get all apply job successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);

// Apply vào job bằng id
router.post(
  "/apply/:id",
  Authentication,
  Authorizetion(constants.USERR_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    let job = await jobsController.ApplyJob(id, req.user._id);
    await userController.ApplyJob(id, req.user._id);
    sendSuccess(res, job, "Apply job successfully", 200);
  }
);
// Tạo job bởi company
router.post(
  "/",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  async function (req, res, next) {
    try {
      console.log(req.body);
      let newJob = await jobsController.CreateJob(req.body);
      sendSuccess(res, newJob, "Create job successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// Cập nhật job
router.put(
  "/:id",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  async function (req, res, next) {
    try {
      let newJob = await jobsController.UpdateJob(
        req.params.id,
        req.body,
        req.user
      );
      sendSuccess(res, newJob, "Update job successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
// Xóa job
router.delete(
  "/:id",
  Authentication,
  Authorizetion(constants.COMPANY_PERMISSION),
  async function (req, res, next) {
    try {
      let job = await jobsController.DeleteJob(req.params.id, req.user);
      sendSuccess(res, null, "Delete job successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);
module.exports = router;
