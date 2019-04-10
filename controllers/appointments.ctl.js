const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const { JWT_SECRET } = require('../consts');
const { freeTimeAlg } = require('./algs/free-alg');
const { booked } = require('./algs/free-alg');

module.exports = {
	// freeTimeByPurpose: async (req, res, next) => {
	// 	console.log(req.params.b_id); //business id
	// 	console.log(req.params.c_id); //catagory id
	// 	console.log(req.params.p_id); // purpose id

	// 	// var business = await Businesses.find({});
	// 	// console.log(business);
	// 	res.json('success');
	// },
	// b3d lazm bdekot

	setAppointment: async (req, res, next) => {
		//req businessId costumerId Time Date  porpuse day
		const businessId = req.params.businessId;
		console.log(req.params.businessId);
		const newAppointment = new Appointments({
			business_id: req.params.businessId,
			client_id: req.params.costumerId,
			time: {
				day: req.params.day,
				date: req.params.date,
				hours: req.params.hours, //UseLess /* Date Type Contains date and time */
				minutes: req.params.minutes
			},
			porpouses: [ req.params.purpose ]
		});
		await newAppointment.save();
		res.json('success');
	},
	deleteAppointment: async (req, res, next) => {
		const QueryRes = await Appointments.deleteOne({ _id: req.params.appointmentId });
		res.json({ QueryRes });
	},

	getClientsAppointments: async (req, res, next) => {
		//getmyappointment for clients
		const QueryRes = await Appointments.find({ client_id: req.params.clientId });
		res.json({ QueryRes });
	},
	getBusinessAppointments: async (req, res, next) => {
		const appointments = await Appointments.find({ business_id: req.params.businessId }).sort({ 'time.date': 1 });
		res.json({ appointments });
	},
	setBusinessApoointment: async (req, res, next) => {
		const { client, business, services, start, end, date } = req.body;

		var newDate = new Date(date);
		const hours = end._hour - start._hour;
		const minutes = end._minute - start._minute;
		newDate.setHours(start._hour, start._minute);
		const newAppointment = new Appointments({
			business_id: business,
			client_id: client,
			time: {
				date: newDate,
				hours: hours,
				minutes: minutes
			},
			porpouses: services
		});
		const appointment = await newAppointment.save();
		if (!appointment) return res.status(403).json({ error: 'an error occoured' });

		booked(business, date, { _start: start, _end: end });
		res.status(200).json({ appointment });
	}
};
