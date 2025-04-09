var express = require("express");
var router = express.Router();
var positionTypeController = require("../controllers/positionTypes"); 
let { sendError, sendSuccess } = require("../utils/responseHandler"); 
let { Authentication, Authorizetion } = require("../utils/check_auth");
let constants = require("../utils/constants");
const mongoose = require('mongoose');

/* GET: Lấy tất cả Position Types (Công khai) */
router.get("/", async function (req, res, next) {
  try {
      let positionTypes = await positionTypeController.GetAllpositionTypes();
      sendSuccess(res, positionTypes, "Get all position types successfully", 200);
  } catch (error) {
       sendError(res, error.message, "SERVER_ERROR", 500);
       next(error);
  }
});

/* GET: Lấy Position Type theo ID (Công khai) */
router.get("/:id", async function (req, res, next) {
  try {
    const positionTypeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(positionTypeId)) {
       return sendError(res, 'Invalid Position Type ID format', 'BAD_REQUEST', 400);
    }

    let positionType = await positionTypeController.GetpositionTypeByID(positionTypeId);
    if (!positionType) {
        return sendError(res, "Position Type not found", "NOT_FOUND", 404);
    }
    sendSuccess(res, positionType, "Get position type successfully", 200);
  } catch (error) {
     if (error.message.includes('Invalid Position Type ID format')) {
          sendError(res, error.message, 'BAD_REQUEST', 400);
     } else if (error.message.includes('not found')) {
          sendError(res, error.message, 'NOT_FOUND', 404);
     }
     else {
          sendError(res, error.message, "SERVER_ERROR", 500);
     }
     next(error);
  }
});

/* POST: Tạo mới Position Type (Chỉ Admin) */
router.post(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
       if (!req.body.name || req.body.name.trim() === "") {
           return sendError(res, "Position Type name is required", "BAD_REQUEST", 400);
       }
      let newPositionType = await positionTypeController.CreatepositionType(
        req.body.name,
        req.body.description
      );
      sendSuccess(res, newPositionType, "Create position type successfully", 201);
    } catch (error) {
       if (error.message.includes('already exists')) {
           sendError(res, error.message, "CONFLICT", 409);
       } else if (error.message.includes('is required')) {
           sendError(res, error.message, "BAD_REQUEST", 400);
       }
       else {
           sendError(res, error.message, "SERVER_ERROR", 500);
       }
      next(error);
    }
  }
);

/* PUT: Cập nhật Position Type theo ID (Chỉ Admin) */
router.put(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
       const positionTypeId = req.params.id;
       if (!mongoose.Types.ObjectId.isValid(positionTypeId)) {
           return sendError(res, 'Invalid Position Type ID format', 'BAD_REQUEST', 400);
       }
       if (!req.body || (req.body.name === undefined && req.body.description === undefined)) {
            return sendError(res, "No update data provided (name or description required)", "BAD_REQUEST", 400);
       }
       if (req.body.name !== undefined && req.body.name.trim() === "") {
            return sendError(res, "Position Type name cannot be empty", "BAD_REQUEST", 400);
       }

       let updatedPositionType = await positionTypeController.UpdatePositionType(positionTypeId, req.body);
       if (!updatedPositionType) {
         return sendError(res, "Position Type not found or update failed", "NOT_FOUND", 404);
       }
       sendSuccess(res, updatedPositionType, "Update position type successfully", 200);
    } catch (error) {
       if (error.message.includes('Invalid Position Type ID format')) {
           sendError(res, error.message, 'BAD_REQUEST', 400);
       } else if (error.message.includes('not found')) {
           sendError(res, error.message, 'NOT_FOUND', 404);
       } else if (error.message.includes('already exists')) {
           sendError(res, error.message, "CONFLICT", 409);
       } else if (error.message.includes('cannot be empty') || error.message.includes('required')) {
            sendError(res, error.message, "BAD_REQUEST", 400);
       }
       else {
           sendError(res, error.message, "SERVER_ERROR", 500);
       }
       next(error);
    }
  }
);

/* DELETE: Xóa mềm Position Type theo ID (Chỉ Admin) */
router.delete(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      const positionTypeId = req.params.id;
       if (!mongoose.Types.ObjectId.isValid(positionTypeId)) {
           return sendError(res, 'Invalid Position Type ID format', 'BAD_REQUEST', 400);
       }

      let result = await positionTypeController.DeletePositionType(positionTypeId);
      
      sendSuccess(res, null, "Delete position type successfully", 200);
    } catch (error) {
       if (error.message.includes('Invalid Position Type ID format')) {
           sendError(res, error.message, 'BAD_REQUEST', 400);
       } else if (error.message.includes('not found')) {
           sendError(res, error.message, 'NOT_FOUND', 404);
       }
       else {
           sendError(res, error.message, "SERVER_ERROR", 500);
       }
       next(error);
    }
  }
);


module.exports = router;