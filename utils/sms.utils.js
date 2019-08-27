require('dotenv').config();
const Appointments = require('../models/appointment');
var constsss = require('../consts');




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
    getBusinessNumberByAppointment: async (AppointmentId) => {
        const appointment = await Appointments.findById(AppointmentId).populate('business_id', 'profile');
        console.log("get", appointment.business_id.profile.phone)
        const result = await appointment.business_id.profile.phone;
        return await result
    },
    sendNotifyReview: async (AppointmentId) => {
        const phoneNumber = await module.exports.getCustomerNumberByAppointment(AppointmentId);
        console.log("phone", phoneNumber.toString())
        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: phoneNumber,
            }),
            body: `it was great seeing you today. Would you take one minute to leave a CountMeIn review about your experience? Here is the link: ${constsss.Client}/sms/customerreview/${AppointmentId}. Thanks for your help!`,
        };
        client.notify
            .services(notifySid)
            .notifications.create(notificationOpts)
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        return

    },
    sendNotifyUpdated: async (AppointmentId) => {
        const phoneNumber = await module.exports.getBusinessNumberByAppointment(AppointmentId);
        console.log("phone", phoneNumber.toString())
        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: phoneNumber,
            }),
            body: `Appointment has been updated , please visit your business dashboard to be updated  , Here is the link: ${constsss.Client}/customerreview/${AppointmentId}.`, //dashboard business
        };
        client.notify
            .services(notifySid)
            .notifications.create(notificationOpts)
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        return

    },

    sendNotifyCanceled: async (AppointmentId) => {
        const phoneNumber = await module.exports.getBusinessNumberByAppointment(AppointmentId);
        console.log("phone", phoneNumber.toString())
        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: phoneNumber,
            }),
            body: `ALERT Appointment has been Canceled , please visit your business dashboard to be updated  , Here is the link: ${constsss.Client}.`, //dashboard business
        };
        client.notify
            .services(notifySid)
            .notifications.create(notificationOpts)
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        return

    },

    sendNotifyAdded: async (AppointmentId) => {
        const phoneNumber = await module.exports.getCustomerNumberByAppointment(AppointmentId);
        console.log("phone", phoneNumber.toString())
        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: phoneNumber,
            }),
            body: `New Appointment has been Added , please visit your business dashboard to be updated  , Here is the link: ${constsss.Client}.`, //dashboard business
        };
        client.notify
            .services(notifySid)
            .notifications.create(notificationOpts)
            .then(notification => console.log(notification.sid))
            .catch(error => console.log(error));

        return

    },


    // sendMorningInsights : async () => { 

    // }


};

