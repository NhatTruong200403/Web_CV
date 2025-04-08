var express = require("express");
var router = express.Router();
var positionTypeController = require("../controllers/positionTypes");
let { sendError, sendSuccess } = require("../utils/responseHandler");
let { Authentication, Authorizetion } = require("../utils/check_auth");
let constants = require("../utils/constants");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  let jobTypes = await positionTypeController.GetAllpositionTypes();
  sendSuccess(res, jobTypes, "Get all position types successfully", 200);
});
router.get("/:id", async function (req, res, next) {
  let jobTypes = await positionTypeController.GetpositionTypeByID(
    req.params.id
  );
  sendSuccess(res, jobTypes, "Get all position types successfully", 200);
});
// Tạo mới position type
router.post(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newJobType = await positionTypeController.CreatepositionType(
        req.body.name
      );
      sendSuccess(res, newJobType, "Create position type successfully", 200);
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
