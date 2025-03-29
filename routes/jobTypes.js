var express = require('express');
var router = express.Router();
var jobTypeController = require('../controllers/jobTypes')
let {sendError,sendSuccess} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let jobTypes = await jobTypeController.GetAllJobTypes();
  sendSuccess(res,jobTypes,"Get all job types successfully",200);
});

router.post('/', async function(req, res, next) {
 try {
    let newJobType = await jobTypeController.CreateJobType(req.body.name);
    sendSuccess(res,newJobType,"Create job type successfully",200);
 } catch (error) {
    next(error)
 }
});
module.exports = router;
