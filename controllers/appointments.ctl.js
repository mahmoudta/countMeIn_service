const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');

const { JWT_SECRET } = require('../consts');
const { freeTimeAlg } = require('./algs/free-alg');
const { booked } = require('./algs/free-alg');

module.exports = {
	setAppointment: async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);
		newDate.setHours(Number(shour), Number(sminute));
		const newAppointment = new Appointments(
			{
				business_id: businessId,
				client_id: costumerId,
				time: {
					date: newDate,
					start: {
						_hour: shour,
						_minute: sminute
					},
					end: {
						_hour: ehour,
						_minute: eminute
					}
				},
				services: [ service ]
			}

			// 	business_id: businessId,
			// 	client_id: costumerId,
			// 	time: {
			// 		date: newDate,
			// 		hours: hhours, //UseLess /* Date Type Contains date and time */
			// 		minutes: mminutes
			// 	},
			// 	porpouses: [ service ]
			// }
		);
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
	deleteBusinessAppointment: async (req, res, next) => {
		const { appointment_id } = req.params;
	},
	setBusinessApoointment: async (req, res, next) => {
		const { client, business, services, start, end, date } = req.body;

		var newDate = new Date(date);
		console.log(start);
		console.log(end);
		const newAppointment = new Appointments({
			business_id: business,
			client_id: client,
			time: {
				date: newDate,
				start: start,
				end: end
			},
			services: services
		});
		const appointment = await newAppointment.save();
		if (!appointment) return res.status(403).json({ error: 'an error occoured' });

		booked(business, date, { _start: start, _end: end });
		res.status(200).json({ appointment });
	},

	getBusinessAppointmentsByDate: async (req, res, next) => {
		const { date, business_id } = req.params;
		var parts = date.split('-');
		const Ndate = new Date(parts[0], parts[1] - 1, parts[2]);
		const appointments = await Appointments.find({ business_id: business_id, 'time.date': Ndate });
		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		const data = await getAppointmentData(appointments);
		return res.json({ data });
	}

	// getBusinessAppointmentsByDate: async (req, res, next) => {
	// 	const { date, business_id } = req.params;
	// 	var parts = date.split('-');
	// 	const Ndate = new Date(parts[0], parts[1] - 1, parts[2]);
	// 	console.log(Ndate);
	// 	const appointments = await Appointments.find({ business_id: business_id, 'time.date': Ndate });
	// 	if (!appointments) return res.status(403).json({ error: 'an error occoured' });

	// 	const data = await getAppointmentData(appointments);
	// 	return res.json({ data });
	// }
};

const getAppointmentData = async (appointments) => {
	var data = [];
	for (const appointment of appointments) {
		const user = await Users.findById(appointment.client_id, 'profile.name');
		// const business = await Businesses.findById(appointment.business_id);

		// const Nservices = await Categories.find({ 'subCats._id': { $in: appointment.services } });
		await data.push({
			appointment,
			user
		});
	}
	return await data;
};
