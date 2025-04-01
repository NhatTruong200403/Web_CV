var express = require("express");
var router = express.Router();
var jobsController = require("../controllers/jobs");
let { sendError, sendSuccess } = require("../utils/responseHandler");
let constants = require('../utils/constants')
const { check_authentication, check_authorization } = require("../utils/check_auth");

router.get("/", async function (req, res, next) {
  let jobTypes = await jobsController.GetAllJobs();
  sendSuccess(res, jobTypes, "Get all jobs successfully", 200);
});
router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let jobTypes = await jobsController.GetJobById(id);
  sendSuccess(res, jobTypes, "Get job successfully", 200);
});

router.post("/", check_authentication, check_authorization(constants.COMPANY_PERMISSION),async function (req, res, next) {
  try {
    let newJobType = await jobsController.CreateJob(req.body);
    sendSuccess(res, newJobType, "Create job successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.put("/:id",  check_authentication, check_authorization(constants.COMPANY_PERMISSION), async function (req, res, next) {
  try {
    let newJobType = await jobsController.UpdateJob(req.params.id,req.body, req.user);
    sendSuccess(res, newJobType, "Update job successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.delete("/:id",  check_authentication, check_authorization(constants.COMPANY_PERMISSION),async function (req, res, next) {
  try {
    let job = await jobsController.DeleteJob(req.params.id, req.user);
    sendSuccess(res, job, "Delete job successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
})
module.exports = router;
