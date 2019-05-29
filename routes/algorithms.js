const algorithmsCtl = require("../controllers/algorithms.ctl");
const router = require("express-promise-router")();

//router.route('/freeTimeByPurpose/:b_id&:c_id&p_id').get(appointmentCtl.freeTimeByPurpose);
router.route("/freetime").post(algorithmsCtl.getFreeTime);

router.route("/smart").post(algorithmsCtl.getSmartTime);

module.exports = router;
