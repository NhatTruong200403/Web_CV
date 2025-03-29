var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { check_authentication,check_authorization } = require('../utils/check_auth')
let { sendSuccess,sendError } = require('../utils/responseHandler')
let constants = require('../utils/constants');
const companies = require('../controllers/companies');
const { uploadImage } = require('../utils/file');
const upload = require("../config/multer");
/* GET users listing. */
router.get('/', check_authentication,
  check_authorization(constants.ADMIN_PERMISSION)
,async function (req, res, next) {
  try {
    let users = await userController.GetAllUsers();
    sendSuccess(res, users,"Get info user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.post('/',check_authentication, async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.CreateAnUser(
      body.username, body.password, body.email, body.role
    )
    sendSuccess(res, user,"Create user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.UpdateAnUser(req.params.id, body)
    sendSuccess(res, user,"Update user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.post('/upCompanies/:taxCode', check_authentication, upload.single("image") ,async function (req, res, next) {
  try {
    let taxCode = req.params.taxCode;
    let imageUrl = "";
    if(req.file || req.description|| req.websiteUrl){
      sendError(res, "Missing file or description or website URL ", "SERVER_ERROR", 500);
    }
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }
    else{
      sendError(res, "No file uploaded", "SERVER_ERROR", 500);
    }
    let result = await companies.CheckCompanyTaxCode(taxCode,req.body,imageUrl, req.user._id);
    // let user = await userController.UpdateAnUser(req.params.id, body)
    // sendSuccess(res, user,"Update user successfully", 200);
  } catch (error) {
    sendError(res, error.message, "SERVER_ERROR", 500);
  }
});
router.post('/uploadIMG', upload.single("image"),  async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    let url = await uploadImage(req.file, "users");
    console.log(url);
    res.json({ url: url });
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.DeleteAnUser(req.params.id)
    CreateSuccessRes(res, user,"Delete user successfully", 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
