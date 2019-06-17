const express = require("express"),
    router = require("express-promise-router")();
const smsCtl = require('../controllers/sms.ctl');



router.route("/verfy").post(smsCtl.Verfy);
router.route("/CheckVerfy").post(smsCtl.CheckVerfy);

module.exports = router;
