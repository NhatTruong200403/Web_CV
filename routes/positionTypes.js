var express = require('express');
var router = express.Router();
var positionTypeController = require('../controllers/positionTypes')
let {sendError,sendSuccess} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let jobTypes = await positionTypeController.GetAllpositionTypes();
  sendSuccess(res,jobTypes,"Get all position types successfully",200);
});

router.post('/', async function(req, res, next) {
 try {
    let newJobType = await positionTypeController.CreatepositionType(req.body.name);
    sendSuccess(res,newJobType,"Create position type successfully",200);
 } catch (error) {
    next(error)
 }
});
module.exports = router;
