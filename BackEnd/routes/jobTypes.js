var express = require("express");
var router = express.Router();
var jobTypeController = require("../controllers/jobTypes");
let { sendError, sendSuccess } = require("../utils/responseHandler");
let { Authentication, Authorizetion } = require("../utils/check_auth");
let constants = require("../utils/constants");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  let jobTypes = await jobTypeController.GetAllJobTypes();
  sendSuccess(res, jobTypes, "Get all job types successfully", 200);
});
router.get("/:id", async function (req, res, next) {
  let jobTypes = await jobTypeController.GetJobTypeById(req.params.id);
  sendSuccess(res, jobTypes, "Get all job types successfully", 200);
});
// Tạo mới job type
router.post(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newJobType = await jobTypeController.CreateJobType(req.body.name);
      sendSuccess(res, newJobType, "Create job type successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
