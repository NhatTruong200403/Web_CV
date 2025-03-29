var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let {sendError,sendSuccess} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let roles = await roleController.GetAllUser();
  sendSuccess(res,roles,"Get all roles successfully",200);
});

router.post('/', async function(req, res, next) {
 try {
    let newRole = await roleController.CreateRole(req.body.name);
    sendSuccess(res,newRole,"Create role successfully",200);
 } catch (error) {
    next(error)
 }
});


module.exports = router;
