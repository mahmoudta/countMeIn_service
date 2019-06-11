const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');

const { JWT_SECRET } = require('../consts');
// const { freeTimeAlg } = require('./algs/free-alg');
const { booked, deleted } = require('./algs/free-alg');
const { getServices } = require('../utils/appointment.utils');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {
	setAppointment                : async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		console.log(newDate);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);
		console.log(newDate);

		const newAppointment = new Appointments(
			{
				_id         : new mongoose.Types.ObjectId(),
				business_id : businessId,
				client_id   : costumerId,
				time        : {
					date  : newDate,
					start : {
						_hour   : shour,
						_minute : sminute
					},
					end   : {
						_hour   : ehour,
						_minute : eminute
					}
				},
				services    : [ service ]
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
		// booked(businessId, newDate, {
		//   _start: { _hour: Number(12), _minute: Number(10) },
		//   _end: { _hour: Number(13), _minute: Number(10) }
		// });
		booked(businessId, newDate, {
			_start : newAppointment.time.start,
			_end   : newAppointment.time.end
		});
		res.status(200).json('suceess');
	},
	deleteAppointment             : async (req, res, next) => {
		const { appointmentId } = req.body;
		const thisAppointment = await Appointments.findById(appointmentId);

		if (thisAppointment.time.end._minute === null) {
			thisAppointment.time.end._minute = 0;
		}

		console.log(thisAppointment.business_id);
		console.log(thisAppointment.time.date);
		console.log(thisAppointment.time.start);
		console.log(thisAppointment.time.end);

		const QueryRes = await Appointments.deleteOne({ _id: appointmentId }, (err) => {
			if (err) {
				res.send(err);
			}
		});

		const del = await deleted(thisAppointment.business_id, thisAppointment.time.date, {
			_start : {
				_hour   : Number(thisAppointment.time.start._hour),
				_minute : Number(thisAppointment.time.start._minute)
			},
			_end   : {
				_hour   : Number(thisAppointment.time.end._hour),
				_minute : Number(thisAppointment.time.end._minute)
			}
		});
		console.log(del);
		res.json({ QueryRes });
	},

	getClientsAppointments        : async (req, res, next) => {
		//getmyappointment for clients
		const QueryRes = await Appointments.find({
			client_id : req.params.clientId
		});
		res.json({ QueryRes });
	},

	getBusinessAppointments       : async (req, res, next) => {
		const appointments = await Appointments.find({
			business_id : req.params.businessId
		}).sort({ 'time.date': 1 });
		res.json({ appointments });
	},

	getSubCategories              : async (req, res, next) => {
		const QueryRes = await Businesses.findById(req.params.businessId, 'profile.purposes', function(err, usr) {});
		console.log(req.params.businessId);

		//const subCategories = await Categories.findOne(category._id);

		res.status(200).json({ QueryRes });
	},

	setBusinessAppointment        : async (req, res, next) => {
		const { client_id, business_id, services, _start, _end, date } = req.body;
		const newServices = await services.map((service) => {
			return service.value;
		});
		var newDate = new Date(date);

		const newAppointment = new Appointments({
			_id         : new mongoose.Types.ObjectId(),
			business_id : business_id,
			client_id   : client_id,
			time        : {
				date  : newDate,
				start : _start,
				end   : _end
			},
			services    : newServices
		});

		const appointment = await newAppointment.save();
		if (!appointment) return res.json({ error: 'an error occoured' });

		const addedAppointment = await Appointments.findById(appointment._id)
			.populate('services')
			.populate('client_id', 'profile');
		/* 
		*	booked function should take:  
		*	business_id
		*	Utc Date()....
		*	_start:{_hour:number,_minute:_}
		*/
		const elem = await booked(business_id, date, { _start, _end });

		if (elem) res.status(200).json({ appointment: addedAppointment });
	},

	getBusinessAppointmentsByDate : async (req, res, next) => {
		const { date, business_id } = req.params;
		var parts = date.split('-');
		const Ndate = new Date(parts[0], parts[1] - 1, parts[2]);
		const appointments = await Appointments.find({
			business_id : business_id,
			'time.date' : Ndate
		})
			.populate('client_id', 'profile')
			.populate('services', 'title');

		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		return res.json({ appointments });
	},
	getTodayUpcomingAppointments  : async (req, res, next) => {
		let date = moment().format('L');
		date = moment(date).toDate();

		const appointments = await Appointments.find({
			business_id : req.params.business_id,
			// 'time.date': {
			// 	$gte: dateNow
			// },
			'time.date' : date,
			status      : { $in: [ 'ready', 'inProgress' ] }
		})
			.limit(5)
			.sort({ 'time.start._hour': 1, 'time.start.minute': 1 })
			.populate('services')
			.populate('client_id', 'profile');
		// .sort(appointment_a,appointmentb)=>{
		// 	let time_a = new Date(appointment.time.start._hour,appointment.time.start._minute,0,0);
		// 	return time_a < time_b;
		// });
		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		return res.status(200).json({ appointments });
	},
	appointmentCheck              : async (req, res, next) => {
		console.log('set apppointment active');
		const { appointment_id, action } = req.params;
		let query = {};
		switch (action) {
			case 'in':
				query = { $set: { status: 'inProgress', 'time.check_in': new Date() } };
				break;
			case 'out':
				query = { $set: { status: 'done', 'time.check_out': new Date() } };
				break;
		}
		const appointment = await Appointments.findOneAndUpdate({ _id: appointment_id }, query, { new: true })
			.populate('services')
			.populate('client_id', 'profile');
		if (appointment) {
			res.status(200).json({ appointment });
		}
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
