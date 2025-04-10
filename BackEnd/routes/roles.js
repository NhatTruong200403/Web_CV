// routes/roles.js
var express = require("express");
var router = express.Router();
var roleController = require("../controllers/roles"); // Đảm bảo controller này có đủ các hàm GetRoleById, UpdateRole, DeleteRole
let { sendError, sendSuccess } = require("../utils/responseHandler");
let { Authentication, Authorizetion } = require("../utils/check_auth");
let constants = require("../utils/constants");

// GET: Lấy tất cả roles
router.get(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let roles = await roleController.GetAllRoles();
      sendSuccess(res, roles, "Get all roles successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
      next(error);
    }
  }
);

// GET: Lấy role theo ID
router.get(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      const roleId = req.params.id;
      let role = await roleController.GetRoleById(roleId);
      if (!role) {
        return sendError(res, "Role not found", "NOT_FOUND", 404);
      }
      sendSuccess(res, role, "Get role successfully", 200);
    } catch (error) {
      sendError(res, error.message, "SERVER_ERROR", 500);
      next(error);
    }
  }
);

// POST: Tạo mới role
router.post(
  "/",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      if (!req.body.name || req.body.name.trim() === "") {
        return sendError(res, "Role name is required", "BAD_REQUEST", 400);
      }
      let newRole = await roleController.CreateRole(req.body.name, req.body.description);
      sendSuccess(res, newRole, "Create role successfully", 201);
    } catch (error) {
      if (error.code === 11000) {
         sendError(res, "Role name already exists", "CONFLICT", 409);
      } else {
         sendError(res, error.message, "SERVER_ERROR", 500);
      }
      next(error);
    }
  }
);

// PUT: Cập nhật role theo ID
router.put(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
       const roleId = req.params.id;
      if (!req.body.name || req.body.name.trim() === "") {
        return sendError(res, "Role name is required for update", "BAD_REQUEST", 400);
      }
       let updatedRole = await roleController.UpdateRole(roleId, req.body.name);
       if (!updatedRole) {
         return sendError(res, "Role not found or update failed", "NOT_FOUND", 404);
       }
       sendSuccess(res, updatedRole, "Update role successfully", 200);
    } catch (error) {
       if (error.code === 11000) {
          sendError(res, "Role name already exists", "CONFLICT", 409);
       } else {
          sendError(res, error.message, "SERVER_ERROR", 500);
       }
       next(error);
    }
  }
);

// DELETE: Xóa role theo ID
router.delete(
  "/:id",
  Authentication,
  Authorizetion(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      const roleId = req.params.id;
      let result = await roleController.DeleteRole(roleId);
      if (!result || (result.deletedCount !== undefined && result.deletedCount === 0)) {
          return sendError(res, "Role not found or could not be deleted", "NOT_FOUND", 404);
      }
      sendSuccess(res, null, "Delete role successfully", 200);
    } catch (error) {
       sendError(res, error.message, "SERVER_ERROR", 500);
       next(error);
    }
  }
);

module.exports = router;
