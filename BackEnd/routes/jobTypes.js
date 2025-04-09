// routes/jobTypes.js
var express = require("express");
var router = express.Router();
var jobTypeController = require("../controllers/jobTypes"); // Đảm bảo controller có đủ hàm
let { sendError, sendSuccess } = require("../utils/responseHandler");
let { Authentication, Authorizetion } = require("../utils/check_auth");
let constants = require("../utils/constants");

/* GET: Lấy tất cả */
router.get("/", async function (req, res, next) {
  try {
    let jobTypes = await jobTypeController.GetAllJobTypes();
    sendSuccess(res, jobTypes, "Get all job types successfully", 200);
  } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
      next(error);
  }
});

/* GET: Lấy theo ID */
router.get("/:id", async function (req, res, next) {
   try {
     const jobTypeId = req.params.id;
     let jobType = await jobTypeController.GetJobTypeById(jobTypeId);
     if (!jobType) {
       return sendError(res, "Job Type not found", "NOT_FOUND", 404);
     }
     sendSuccess(res, jobType, "Get job type successfully", 200);
  } catch (error) {
     sendError(res, error.message, "SERVER_ERROR", 500);
     next(error);
  }
});

/* POST: Tạo mới */
router.post(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      if (!req.body.name || req.body.name.trim() === "") {
         return sendError(res, "Job Type name is required", "BAD_REQUEST", 400);
      }
      let newJobType = await jobTypeController.CreateJobType(req.body.name, req.body.description);
      sendSuccess(res, newJobType, "Create job type successfully", 201);
    } catch (error) {
      if (error.code === 11000) {
          sendError(res, error.message, "CONFLICT", 409);
      } else {
          sendError(res, error.message, "SERVER_ERROR", 500);
      }
      next(error);
    }
  }
);

/* PUT: Cập nhật theo ID */
router.put(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
       const jobTypeId = req.params.id;
       if (!req.body.name || req.body.name.trim() === "") {
          return sendError(res, "Job Type name is required for update", "BAD_REQUEST", 400);
       }
       let updatedJobType = await jobTypeController.UpdateJobType(jobTypeId, req.body);
       if (!updatedJobType) {
         return sendError(res, "Job Type not found or update failed", "NOT_FOUND", 404);
       }
       sendSuccess(res, updatedJobType, "Update job type successfully", 200);
    } catch (error) {
       if (error.code === 11000) {
           sendError(res, error.message, "CONFLICT", 409);
       } else {
           sendError(res, error.message, "SERVER_ERROR", 500);
       }
       next(error);
    }
  }
);

/* DELETE: Xóa theo ID */
router.delete(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      const jobTypeId = req.params.id;
      let result = await jobTypeController.DeleteJobType(jobTypeId);
      if (!result) {
         return sendError(res, "Job Type not found or could not be deleted", "NOT_FOUND", 404);
      }
      sendSuccess(res, null, "Delete job type successfully", 200);
    } catch (error) {
       sendError(res, error.message, "SERVER_ERROR", 500);
    }
  }
);


module.exports = router;