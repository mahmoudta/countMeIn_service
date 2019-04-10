const appointmentCtl = require('../controllers/appointments.ctl');
const router = require('express-promise-router')();

//router.route('/freeTimeByPurpose/:b_id&:c_id&p_id').get(appointmentCtl.freeTimeByPurpose);
router
	.route('/setAppointment/:businessId/:costumerId/:purpose/:day/:date/:hours/:minutes')
	.get(appointmentCtl.setAppointment);
router.route('/deleteAppointment/:appointmentId').get(appointmentCtl.deleteAppointment);
router.route('/getClientsAppointments/:clientId').get(appointmentCtl.getClientsAppointments);
router.route('/getBusinessAppointments/:businessId').get(appointmentCtl.getBusinessAppointments);
router.route('/business/setAppointmnet').post(appointmentCtl.setBusinessApoointment);

module.exports = router;
