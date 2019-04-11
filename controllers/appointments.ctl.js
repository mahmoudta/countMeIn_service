const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');

const { JWT_SECRET } = require('../consts');
const { freeTimeAlg } = require('./algs/free-alg');
const { booked } = require('./algs/free-alg');

module.exports = {
	setAppointment: async (req, res, next) => {
		const { businessId, costumerId, purpose, date, shour, sminute, ehour, eminute } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		const hhours = ehour - shour;
		const mminutes = eminute - sminute;
		newDate.setHours(parseInt(shour, 10), parseInt(sminute, 10));
		const newAppointment = new Appointments({
			business_id: businessId,
			client_id: costumerId,
			time: {
				date: newDate,
				hours: Number(shour), //UseLess /* Date Type Contains date and time */
				minutes: Number(sminute)
			},
			porpouses: [ purpose ]
		});
		console.log(newDate.getHours());
		console.log(newAppointment);
		const appointment = await newAppointment.save();
		if (!appointment) return res.status(403).json({ error: 'an error occoured' });
		//res.json('success');
		booked(businessId, date, {
			_start: { _hour: Number(shour), _minute: Number(sminute) },
			_end: { _hour: Number(ehour), _minute: Number(eminute) }
		});
		res.status(200).json('suceess');
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

	getSubCategories: async (req, res, next) => {
		const QueryRes = await Businesses.findById(req.params.businessId, 'profile.purposes', function(err, usr) {});
		console.log(req.params.businessId);

		//const subCategories = await Categories.findOne(category._id);

		res.status(200).json({ QueryRes });
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
