require('dotenv').config();
const Appointments = require('../models/appointment');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const notifySid = process.env.TWILIO_NOTIFY_SID;
//const { getCustomerNumberByAppointment } = require('./');



const client = require('twilio')(accountSid, authToken);

module.exports = {
    getCustomerNumberByAppointment: async (AppointmentId) => {
        const appointment = await Appointments.findById(AppointmentId).populate('client_id', 'profile');
        console.log("get", appointment.client_id.profile.phone)
        const result = await appointment.client_id.profile.phone;
        return await result
    },
    sendNotify: async (AppointmentId) => {
        const phoneNumber = await module.exports.getCustomerNumberByAppointment(AppointmentId);
        console.log("phone", phoneNumber.toString())
        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: phoneNumber,
            }),
            body: `it was great seeing you today. Would you take one minute to leave a Google review about your experience? Here is the link: http://localhost:3000/sms/customerreview/${AppointmentId}. Thanks for your help!`,
        };
        client.notify
            .services(notifySid)
            .notifications.create(notificationOpts)
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        return

    },

};

