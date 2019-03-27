const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const { JWT_SECRET } = require('../consts');
const { freeTimeAlg } = require('./algs/free-alg');

module.exports = {
	// freeTimeByPurpose: async (req, res, next) => {
	// 	console.log(req.params.b_id); //business id
	// 	console.log(req.params.c_id); //catagory id
	// 	console.log(req.params.p_id); // purpose id

	// 	// var business = await Businesses.find({});
	// 	// console.log(business);
	// 	res.json('success');
	// },

	setAppointment: async (req, res, next) => {
		//req businessId costumerId Time Date  porpuse day
		const businessId = req.params.businessId;
		console.log(businessId);
		const newAppointment = new Appointments({
			business_id: req.params.businessId,
			client_id: req.params.costumerId,
			time: {
				day: req.params.day,
				date: null, //req.date,
				start: null //req.time /* Date Type Contains date and time */
			},
			porpouses: [ req.params.purpose ] //[ req.purpose ]
		});
		await newAppointment.save();
		//res.json({ QueryRes });
		// const doc = await appointments.findOne();

		res.json('success');
	},
	deleteAppointment: async (req, res, next) => {
		const QueryRes = await Appointments.deleteOne({ ID: req.appointmentId });
		res.json({ QueryRes });
	},

	getClientsAppointments: async (req, res, next) => {
		//getmyappointment for clients
		const QueryRes = await Appointments.find({ client_id: req.clientId });
		res.json({ QueryRes });
	}
};
