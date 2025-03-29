var express = require('express');
var router = express.Router();
var jobController = require('../controllers/jobs')
let {sendError,sendSuccess} = require('../utils/responseHandler')

router.get('/', async function(req, res, next) {
  let jobTypes = await positionTypeController.GetAllpositionTypes();
  sendSuccess(res,jobTypes,"Get all position types successfully",200);
});

router.post('/', async function(req, res, next) {
 try {
    let newJobType = await jobController.CreateJob(req.body);
    sendSuccess(res,newJobType,"Create job successfully",200);
 } catch (error) {
    next(error)
 }
});
module.exports = router;
