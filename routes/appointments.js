const appointmentCtl = require('../controllers/appointments.ctl');
const router = require('express-promise-router')();

//router.route('/freeTimeByPurpose/:b_id&:c_id&p_id').get(appointmentCtl.freeTimeByPurpose);
router.route('/setAppointment/:businessId/:costumerId/:purpose/:day').get(appointmentCtl.setAppointment);
router.route('/deleteAppointment/:appointmentId').get(appointmentCtl.deleteAppointment);
router.route('/getClientsAppointments/:clientId').get(appointmentCtl.getClientsAppointments);

module.exports = router;
