const appointmentCtl = require('../controllers/appointments.ctl');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

//router.route('/freeTimeByPurpose/:b_id&:c_id&p_id').get(appointmentCtl.freeTimeByPurpose);
router.route('/setAppointment').post(passportJWT, appointmentCtl.setAppointment);
router.route('/deleteAppointment').post(appointmentCtl.deleteAppointment);
router.route('/getClientsAppointments/:clientId').get(appointmentCtl.getClientsAppointments);
router.route('/getBusinessAppointments/:businessId').get(appointmentCtl.getBusinessAppointments);
router.route('/getSubCategories/:businessId').get(appointmentCtl.getSubCategories);
router.route('/business/setAppointmnet').post(appointmentCtl.setBusinessAppointment);
router.route('/getBusinessAppointmentsByDate/:business_id/:date').get(appointmentCtl.getBusinessAppointmentsByDate);
router
	.route('/getTodayUpcomingAppointments/:business_id')
	.get(passportJWT, appointmentCtl.getTodayUpcomingAppointments);
router.route('/appointmentCheck/:appointment_id/:action').put(appointmentCtl.appointmentCheck);

module.exports = router;
