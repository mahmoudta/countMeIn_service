const appointmentCtl = require('../controllers/appointments.ctl');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

//router.route('/freeTimeByPurpose/:b_id&:c_id&p_id').get(appointmentCtl.freeTimeByPurpose);
router.route('/CheckEdit/:appointmentId').get(appointmentCtl.CheckEdit);
router.route('/setAppointment').post(passportJWT, appointmentCtl.setAppointment);
router.route('/setAppointmentAndDelete').post(passportJWT, appointmentCtl.setAppointmentAndDelete);
router.route('/deleteAppointment').post(appointmentCtl.deleteAppointment);
router.route('/getClientsAppointments/:clientId').get(appointmentCtl.getClientsAppointments);
router.route('/getBusinessAppointments/:businessId').get(appointmentCtl.getBusinessAppointments);
router.route('/getSubCategories/:businessId').get(appointmentCtl.getSubCategories);
router.route('/business/setAppointmnet').post(appointmentCtl.setBusinessAppointment);
router
	.route('/business/BusinessStatisticsHeader/:business_id')
	.get(passportJWT, appointmentCtl.BusinessStatisticsHeader);
router.route('/getBusinessAppointmentsByDate/:business_id/:date').get(appointmentCtl.getBusinessAppointmentsByDate);
router
	.route('/getTodayUpcomingAppointments/:business_id')
	.get(passportJWT, appointmentCtl.getTodayUpcomingAppointments);
router.route('/setBusinessReview').put(passportJWT, appointmentCtl.setBusinessReview);
router.route('/setCustomerReview').put(passportJWT, appointmentCtl.setCustomerReview);
router.route('/appointmentCheck').put(appointmentCtl.appointmentCheck);
router.route('/newnewnew/reviews').get(appointmentCtl.createReviews);
router.route('/getReviewByBusinessId/:business_id').get(passportJWT, appointmentCtl.getReviewByBusinessId);

router.route('/getReviewAsCustomer').get(passportJWT, appointmentCtl.getReviewAsCustomer);

router.route('/getIsRated/:appointmentId').get(passportJWT, appointmentCtl.getIsRated);

module.exports = router;
