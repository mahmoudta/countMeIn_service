const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');
const Review = require('../models/review');
const { smart } = require('./algs/free-alg');

const { JWT_SECRET } = require('../consts');
// const { freeTimeAlg } = require('./algs/free-alg');

// setAppointment: async (req, res, next) => {
// 	const { businessId, costumerId, service, date, shour, sminute, ehour, eminute } = req.body;
// 	//console.log(sstart);

// 	var newDate = new Date(date);
// 	console.log(newDate);
// 	const hhours = Number(ehour) - Number(shour);
// 	const mminutes = Number(eminute) - Number(sminute);
// 	console.log(newDate);

// 	const newAppointment = new Appointments(
// 		{
// 			_id: new mongoose.Types.ObjectId(),
// 			business_id: businessId,
// 			client_id: costumerId,
// 			time: {
// 				date: newDate,
// 				start: {
// 					_hour: shour,
// 					_minute: sminute
// 				},
// 				end: {
// 					_hour: ehour,
// 					_minute: eminute
// 				}
// 			},
// 			services: service
// 		}

// 		// 	business_id: businessId,
// 		// 	client_id: costumerId,
// 		// 	time: {
// 		// 		date: newDate,
// 		// 		hours: hhours, //UseLess /* Date Type Contains date and time */
// 		// 		minutes: mminutes
// 		// 	},
// 		// 	porpouses: [ service ]
// 		// }
// 	);
// 	console.log(newDate.getHours());
// 	console.log(newAppointment);
// 	const appointment = await newAppointment.save();
// 	if (!appointment) return res.status(403).json({ error: 'an error occoured' });
// 	//res.json('success');
// 	// booked(businessId, newDate, {
// 	//   _start: { _hour: Number(12), _minute: Number(10) },
// 	//   _end: { _hour: Number(13), _minute: Number(10) }
// 	// });
// 	booked(businessId, newDate, {
// 		_start: newAppointment.time.start,
// 		_end: newAppointment.time.end
// 	});
// 	res.status(200).json('suceess');
// },

// deleteAppointment: async (req, res, next) => {
// 	const { appointmentId } = req.body;
// 	const thisAppointment = await Appointments.findById(appointmentId);

// 	if (thisAppointment.time.end._minute === null) {
// 		thisAppointment.time.end._minute = 0;
// 	}

// 	console.log(thisAppointment.business_id);
// 	console.log(thisAppointment.time.date);
// 	console.log(thisAppointment.time.start);
// 	console.log(thisAppointment.time.end);

// 	const QueryRes = await Appointments.deleteOne({ _id: appointmentId }, (err) => {
// 		if (err) {
// 			res.send(err);
// 		}
// 	});

// 	const del = await deleted(thisAppointment.business_id, thisAppointment.time.date, {
// 		_start: {
// 			_hour: Number(thisAppointment.time.start._hour),
// 			_minute: Number(thisAppointment.time.start._minute)
// 		},
// 		_end: {
// 			_hour: Number(thisAppointment.time.end._hour),
// 			_minute: Number(thisAppointment.time.end._minute)
// 		}
// 	});
// 	console.log(del);
// 	res.json({ QueryRes });
// },

// getClientsAppointments: async (req, res, next) => {
// 	//getmyappointment for clients
// 	const QueryRes = await Appointments.find({
// 		client_id: req.params.clientId
// 	});
// 	res.json({ QueryRes });
// },

// getBusinessAppointments: async (req, res, next) => {
// 	const appointments = await Appointments.find({
// 		business_id: req.params.businessId
// 	}).sort({ 'time.date': 1 });
// 	res.json({ appointments });
// },

// getSubCategories: async (req, res, next) => {
// 	const QueryRes = await Businesses.findById(req.params.businessId, 'profile.purposes', function (err, usr) { });
// 	console.log(req.params.businessId);

// 	//const subCategories = await Categories.findOne(category._id);

// 	res.status(200).json({ QueryRes });
// },

// setBusinessApoointment: async (req, res, next) => {
// 	const { client, business, services, start, end, date } = req.body;

// 	var newDate = new Date(date);
// 	console.log(start);
// 	console.log(end);
// 	const newAppointment = new Appointments({
// 		business_id: business,
// 		client_id: client,
// 		time: {
// 			date: newDate,
// 			start: start,
// 			end: end
// 		},
// 		services: services
// 	});
// 	const appointment = await newAppointment.save();
// 	if (!appointment) return res.status(403).json({ error: 'an error occoured' });

// 	booked(business, date, { _start: start, _end: end });
// 	res.status(200).json({ appointment });
// },

// getBusinessAppointmentsByDate: async (req, res, next) => {
// 	const { date, business_id } = req.params;
// 	var parts = date.split('-');
// 	const Ndate = new Date(parts[0], parts[1] - 1, parts[2]);
// 	const appointments = await Appointments.find({
// 		business_id: business_id,
// 		'time.date': Ndate
// 	})
// 		.populate('client_id', 'profile')
// 		.populate('services', 'title');
// 	if (!appointments) return res.status(403).json({ error: 'an error occoured' });

// 	const data = await getAppointmentData(appointments);
// 	return res.json({ appointments: data });
// },
// getTodaysReadyAppointments: async (req, res, next) => {
// 	const dateNow = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);

// 	dateNow.setUTCHours(21, 0, 0, 0);
// 	console.log(dateNow);
// 	// dateNow.setUTCHours(21, 0, 0, 0);
// 	// console.log(dateNow);
// 	const appointments = await Appointments.find({
// 		business_id: req.params.business_id,
// 		// 'time.date': {
// 		// 	$gte: dateNow
// 		// },
// 		'time.date': dateNow,
// 		status: 'ready'
// 	})
// 		.limit(5)
// 		.sort({ 'time.start._hour': 1, 'time.start.minute': 1 });
// 	// .sort(appointment_a,appointmentb)=>{
// 	// 	let time_a = new Date(appointment.time.start._hour,appointment.time.start._minute,0,0);
// 	// 	return time_a < time_b;
// 	// });
// 	if (!appointments) return res.status(403).json({ error: 'an error occoured' });

// 	const data = await getAppointmentData(appointments);
// 	return res.status(200).json({ appointments: data });
// },
// setAppointmentActive: async (req, res, next) => {
// 	console.log('set apppointment active');
// 	const appointment_id = req.params.appointment_id;

// 	const appointment = await Appointments.findOneAndUpdate(
// 		{ _id: appointment_id },
// 		{ $set: { status: 'inProgress' } },
// 		{ new: true }
// 	);
// 	if (appointment) {
// 		const data = await getAppointmentData([appointment]);
// 		res.status(200).json({ appointment: data[0] });
// 	}
// },

// CheckEdit: async (req, res, next) => {
// 	const appointmentId = req.params.appointmentId;
// 	// const businessId = "5cee375f0d1aca9031f57708";
// 	// const date = "2019-07-22T21:00:00.000Z";
// 	// const startMinutes = 25;
// 	// const startHours = 15;
// 	// const endMinutes = 50;
// 	// const endHours = 15;
// 	const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// 	const currentAppoointment = await Appointments.findById(appointmentId);

// 	//console.log("currentAppointment ", currentAppoointment);

// 	const businessId = currentAppoointment.business_id;
// 	const date = currentAppoointment.time.date;
// 	const dayNum = new Date(date).getDay()
// 	console.log("date", date)
// 	const startMinutes = currentAppoointment.time.start._minute;
// 	const startHours = currentAppoointment.time.start._hour;
// 	const endMinutes = currentAppoointment.time.end._minute;
// 	const endHours = currentAppoointment.time.end._hour;

// 	//console.log(businessId, date, startHours, startMinutes, endHours, endMinutes)

// 	const business = await Businesses.find({ '_id': businessId }, `break_time working_hours`);

// 	const todaySch = business[0].working_hours.filter(word => word.day === day[dayNum]);

// 	console.log(todaySch)
// 	var breakTimeBefore = null;
// 	var breakTimeAfter = null;
// 	if (todaySch[0].break.isBreak) {
// 		//break
// 		console.log("found BREAK")
// 		if (todaySch[0].break.until.getHours() < startHours && todaySch[0].break.until.getMinutes() < startMinutes) {
// 			breakTimeBefore = todaySch[0].break;
// 		} if (todaySch[0].break.from.getHours() > endHours && todaySch[0].break.from.getMinutes() > endMinutes) {
// 			breakTimeAfter = todaySch[0].break;
// 		}

// 	}

// 	var today = new Date();
// 	var todayFlag = 0;
// 	console.log("today", today)
// 	//today.setHours(tomorow.getHours() + 1)
// 	if (today.getDate() == date.getDate() && today.getFullYear() == date.getFullYear() && today.getDay() == date.getDay()) {
// 		todayFlag = 1;
// 	}

// 	const appointmentAfter = await Appointments.find({
// 		business_id: businessId, 'time.date': date,
// 		$or: [
// 			{
// 				$and: [
// 					{ 'time.start._hour': { '$gte': endHours } }
// 					, { 'time.start._minute': { '$gte': endMinutes } }]
// 			}
// 			, {
// 				$and: [
// 					{ 'time.start._hour': { '$gt': endHours } }
// 					, { 'time.start._minute': { '$gte': 0 } }]
// 			}
// 		]
// 	}).sort([['time.start._hour', 1], ['time.start._minute', 1]]).limit(1)

// 	const appointmentBefore = await Appointments.find({
// 		business_id: businessId, 'time.date': date,
// 		$or: [
// 			{
// 				$and: [
// 					{ 'time.end._hour': { '$lte': startHours } }
// 					, { 'time.end._minute': { '$lte': startMinutes } }]
// 			}
// 			, {
// 				$and: [
// 					{ 'time.end._hour': { '$lt': startHours } }
// 					, { 'time.end._minute': { '$lte': 0 } }]
// 			}
// 		]
// 	}).sort([['time.start._hour', -1], ['time.start._minute', -1]]).limit(1)
// 	//console.log(appointment[0].time.start._minute)
// 	var TimeAfter = null;
// 	var TimeBefore = null;
// 	//console.log(appointment[0].time.start._hour)
// 	if (!appointmentAfter[0]) {
// 		if (breakTimeAfter != null) {
// 			console.log("!!BreakAfter True AppointmentAfter False", breakTimeAfter)
// 			TimeAfter = (((breakTimeAfter.from.getHours() * 60) + breakTimeAfter.from.getMinutes()) - (startHours * 60 + startMinutes))
// 		} else {
// 			console.log("BreakAfter False appointmmentAfter False todaySch!!")
// 			TimeAfter = (((todaySch[0].until.getHours() * 60) + todaySch[0].until.getMinutes()) - (startHours * 60 + startMinutes))
// 		}
// 		//todaySch.from
// 		//console.log(todaySch[0].from.getHours())
// 	} else {
// 		if (breakTimeAfter != null) {
// 			console.log("BreakAfter true appointmmentafter true")
// 			if (breakTimeAfter.until.getHours() <= appointmentAfter[0].time.start._hour && breakTimeAfter.until.getMinutes() <= appointmentAfter[0].time.start._minute) {
// 				//there is a break between appointmentAfter and current
// 				console.log("!!BreakAfter < appointmmentafter")
// 				TimeAfter = (((breakTimeAfter.from.getHours() * 60) + breakTimeAfter.from.getMinutes()) - (startHours * 60 + startMinutes))
// 			}
// 		} else {
// 			console.log("BreakAfter !< appointmmentafter!!")

// 			TimeAfter = (((appointmentAfter[0].time.start._hour * 60) + appointmentAfter[0].time.start._minute) - (startHours * 60 + startMinutes))
// 		}
// 	}

// 	if (!appointmentBefore[0]) {
// 		if (breakTimeBefore != null) {
// 			console.log("!!BreakBefore True AppointmentAfter False")

// 			if (todayFlag && today.getHours() >= breakTimeBefore.until.getHours() && today.getMinutes() >= breakTimeBefore.until.getMinutes()) {
// 				console.log("today!! > breakTimeBefore")
// 				TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))

// 			} else {
// 				console.log("today < breakTimeBefore!!")
// 				TimeBefore = (((endHours * 60) + endMinutes) - breakTimeBefore.until.getHours() * 60 + breakTimeBefore.until.getMinutes())
// 			}
// 		} else {
// 			if (todaySch[0].from.getHours() <= today.getHours() && todaySch[0].from.getMinutes() <= today.getMinutes() && todayFlag) {
// 				console.log("today")
// 				TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))
// 			} else {
// 				console.log("!!todaySch>today")
// 				TimeBefore = (((endHours * 60) + endMinutes) - (todaySch[0].from.getHours() * 60 + todaySch[0].from.getMinutes()))

// 			}
// 		}

// 	} else {
// 		if (breakTimeBefore != null) {
// 			if (breakTimeBefore.from.getHours() >= appointmentBefore[0].time.start._hour && breakTimeBefore.from.getMinutes() >= appointmentBefore[0].time.start._minute) {
// 				//there is a break between appointmentBefore and current
// 				console.log("BreakBefore true")
// 				if (breakTimeBefore.until.getHours() <= today.getHours() && breakTimeBefore.until.getMinutes() <= today.getMinutes() && todayFlag) {
// 					console.log("breaktimeBEofre<today!! ")
// 					TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))
// 				} else {
// 					console.log("breaktimeBEofre!!>today ")
// 					TimeBefore = ((startHours * 60 + startMinutes) - ((breakTimeBefore.until.getHours() * 60) + breakTimeBefore.until.getMinutes()))
// 				}
// 			} else {
// 				console.log("appointment > ALL Breakbefore True")
// 				TimeBefore = (((endHours * 60) + endMinutes) - ((appointmentBefore[0].time.end._hour * 60) + appointmentBefore[0].time.end._minute))
// 			}

// 		} else {
// 			console.log("breakBefore false")
// 			if (appointmentBefore[0].time.end._hour <= today.getHours() && appointmentBefore[0].time.end._minute <= today.getMinutes() && todayFlag) {
// 				console.log("today!! > appointmeentbefore   ")
// 				TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))

// 			} else {
// 				console.log("appointmentBefore >ALL")
// 				TimeBefore = (((endHours * 60) + endMinutes) - ((appointmentBefore[0].time.end._hour * 60) + appointmentBefore[0].time.end._minute))

// 			}
// 		}

// 	}
// 	const currentAppointmentTime = (((endHours * 60) + endMinutes) - ((startHours * 60) + startMinutes))
// 	TimeTotal = TimeAfter + TimeBefore - currentAppointmentTime;

// 	console.log({ 'FreeTimeTotal': TimeTotal, 'FreeTimeBefore': TimeBefore, 'FreeTimeAfter': TimeAfter, appointmentBefore, appointmentAfter, currentAppointmentTime })
// 	//console.log("appoint", currentAppointmentTime)
// 	res.json({ 'FreeTimeTotal': TimeTotal, 'FreeTimeBefore': TimeBefore, 'FreeTimeAfter': TimeAfter, appointmentBefore, appointmentAfter, oldNeededTime: currentAppointmentTime })

// }

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
// };

// const getAppointmentData = async (appointments) => {
// 	var data = [];
// 	for (let appointment of appointments) {
// 		const user = await Users.findById(appointment.client_id, 'profile.name');
// 		// const business = await Businesses.findById(appointment.business_id);

// 		const Nservices = await Categories.find({
// 			'services._id': { $in: appointment.services }
// 		});
// 		const services = await getServices(Nservices, appointment.services);
// 		await data.push({
// 			_id: appointment._id,
// 			business_id: appointment.business_id,
// 			client: user,
// 			time: {
// 				date: appointment.time.date,
// 				start: appointment.time.start,
// 				end: appointment.time.end
// 			},
// 			services: services,
// 			status: appointment.status
// 		});
// 	}
// 	return await data;

const { booked, deleted, shiftappointmentifpossible } = require('./algs/free-alg');
const { sendNotifyReview, sendNotifyCanceled, sendNotifyAdded, sendNotifyUpdated } = require('../utils/sms.utils');
const { getServices } = require('../utils/appointment.utils');
const mongoose = require('mongoose');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');
const { createReview, insightsRateIncrement } = require('./functions/business.funcs');

module.exports = {
	setAppointment                : async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		console.log(newDate);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);

		const newAppointment = new Appointments(
			{
				_id         : new mongoose.Types.ObjectId(),
				business_id : mongoose.Types.ObjectId(businessId),
				client_id   : mongoose.Types.ObjectId(costumerId),
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
				services    : service
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
		const CanBook = await booked(businessId, newDate, {
			_start : newAppointment.time.start,
			_end   : newAppointment.time.end
		});
		console.log('booked', CanBook);

		if (CanBook) {
			const appointment = await newAppointment.save();
			if (!appointment) return res.status(403).json({ error: 'alrd taken' });

			return res.status(200).json('suceess');
		}
		//res.json('success');
		// booked(businessId, newDate, {
		//   _start: { _hour: Number(12), _minute: Number(10) },
		//   _end: { _hour: Number(13), _minute: Number(10) }
		// });
		return res.status(304).json('booked');
	},
	// setAppointmentAndDelete: async (req, res, next) => {
	// 	const { businessId, costumerId, service, date, shour, sminute, ehour, eminute, appointmentId } = req.body;
	// 	//console.log(sstart);

	// 	var newDate = new Date(date);
	// 	console.log(newDate);
	// 	const hhours = Number(ehour) - Number(shour);
	// 	const mminutes = Number(eminute) - Number(sminute);
	// 	console.log(newDate);

	// 	const newAppointment = new Appointments(
	// 		{
	// 			_id: new mongoose.Types.ObjectId(),
	// 			business_id: businessId,
	// 			client_id: costumerId,
	// 			time: {
	// 				date: newDate,
	// 				start: {
	// 					_hour: shour,
	// 					_minute: sminute
	// 				},
	// 				end: {
	// 					_hour: ehour,
	// 					_minute: eminute
	// 				}
	// 			},
	// 			services: service
	// 		}

	// 	);

	// 	const appointment = await newAppointment.save((err) => {
	// 		if (err) {
	// 			res.send(err);
	// 		}
	// 	if (!appointment) return res.status(403).json({ error: 'an error occoured' });

	// 	const oldAppointment = await Appointments.findById(appointmentId);

	// 	if (thisAppointment.time.end._minute === null) {
	// 		thisAppointment.time.end._minute = 0;
	// 	}
	// 	const thisAppointment = await Appointments.findById(appointment._id);

	// 	if (thisAppointment.time.end._minute === null) {
	// 		thisAppointment.time.end._minute = 0;
	// 	}

	// 	const QueryRes = await Appointments.deleteOne({ _id: appointmentId }, (err) => {
	// 		if (err) {
	// 			res.send(err);
	// 		}

	// 		const deletedResult = deleted(oldAppointment.business_id,
	// 			oldAppointment.time.date, {
	// 				_start: oldAppointment.time.start
	// 				, _end: oldAppointment.time.end
	// 			});

	// 		if (deletedResult) {
	// 			booked(businessId, newDate, {
	// 				_start: newAppointment.time.start,
	// 				_end: newAppointment.time.end
	// 			});
	// 		}

	// 	});

	// 	const del = await deleted(thisAppointment.business_id, thisAppointment.time.date, {
	// 		_start: {
	// 			_hour: Number(thisAppointment.time.start._hour),
	// 			_minute: Number(thisAppointment.time.start._minute)
	// 		},
	// 		_end: {
	// 			_hour: Number(thisAppointment.time.end._hour),
	// 			_minute: Number(thisAppointment.time.end._minute)
	// 		}
	// 	});
	// 	res.status(200).json('suceess');
	// },

	updateAppointmentTime         : async (req, res, next) => {
		const { appointmentId, duration, newServices, businessId } = req.body;
		const thisBusiness = await Businesses.findById(businessId);
		sendNotifyUpdated(appointmentId);

		const thisAppointment = await Appointments.findById(appointmentId);

		if (thisAppointment.time.end._minute === null) {
			thisAppointment.time.end._minute = 0;
		}

		const newDuration = duration + thisBusiness.break_time;
		const endHours = thisAppointment.time.start._hour + Math.floor(newDuration / 60);
		const endMinutes = thisAppointment.time.start._minute + newDuration % 60;
		console.log('services', newServices);
		let update = {
			$set : {
				'time.end' : {
					_hour   : endHours,
					_minute : endMinutes
				},
				services   : newServices
			}
		};
		const updatedAppointment = await Appointments.findOneAndUpdate({ _id: thisAppointment._id }, update, {
			new : true
		});
		if (!updatedAppointment) {
			return res.json({ error: 'error accourd' });
		}
		if (updatedAppointment) {
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
			if (del) {
				booked(updatedAppointment.business_id, updatedAppointment.time.date, {
					_start : updatedAppointment.time.start,
					_end   : updatedAppointment.time.end
				});
			}
		}

		res.status(200).json({ success: 'updated appointment successffuly' });
	},
	setAppointmentAndDelete       : async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute, appointmentId } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		console.log(newDate);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);
		console.log(newDate);

		sendNotifyUpdated(appointmentId);

		const newAppointment = new Appointments({
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
			services    : service
		});

		const appointment = await newAppointment.save();
		if (!appointment) return res.status(403).json({ error: 'an error occoured' });

		const thisAppointment = await Appointments.findById(appointmentId);

		if (thisAppointment.time.end._minute === null) {
			thisAppointment.time.end._minute = 0;
		}

		const QueryRes = await Appointments.deleteOne({ _id: appointmentId }, (err) => {
			if (err) {
				res.send(err);
			}
			//DELETED
			booked(businessId, newDate, {
				_start : newAppointment.time.start,
				_end   : newAppointment.time.end
			});
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
		res.status(200).json('suceess');
	},

	getFreeTimeEdit               : async (req, res, next) => {
		const { appointmentId, newServices } = req.body;
		const thisAppointment = await Appointments.findById(appointmentId);

		if (thisAppointment.time.end._minute === null) {
			thisAppointment.time.end._minute = 0;
		}

		const Free = smart(
			thisAppointment.business_id,
			newServices,
			thisAppointment.customer_id,
			false,
			true,
			true,
			thisAppointment.time.date,
			thisAppointment.time.date,
			{
				_start : {
					_hour   : Number(thisAppointment.time.start._hour),
					_minute : Number(thisAppointment.time.start._minute)
				},
				_end   : {
					_hour   : Number(thisAppointment.time.end._hour),
					_minute : Number(thisAppointment.time.end._minute)
				}
			}
		);

		res.status(200).json({ result: 'success', free: free });
	},
	deleteAppointment             : async (req, res, next) => {
		const { appointmentId } = req.body;
		await sendNotifyCanceled(appointmentId);
		const thisAppointment = await Appointments.findById(appointmentId);

		if (thisAppointment.time.end._minute === null) {
			thisAppointment.time.end._minute = 0;
		}

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
		//console.log(req.params.businessId);

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
		sendNotifyAdded(appointment._id);
		const elem = await booked(business_id, date, { _start, _end }, true, false, client_id);

		if (elem) res.status(200).json({ appointment: addedAppointment });
	},

	getBusinessAppointmentsByDate : async (req, res, next) => {
		/* to change */
		const { date, business_id } = req.params;
		var parts = date.split('-');
		const Ndate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 21, 0, 0));
		console.log(Ndate);
		// const Ndate = new Date.UTC(parts[0], parts[1] - 1, parts[2], 21, 0, 0);
		const appointments = await Appointments.find({
			business_id : business_id,
			'time.date' : Ndate
		})
			.sort({ 'time.start._hour': 1, 'time.start.minute': 1 })
			.populate('client_id', 'profile')
			.populate('services', 'title')
			.populate('review', 'business_review');

		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		return res.json({ appointments });
	},
	getTodayUpcomingAppointments  : async (req, res, next) => {
		// let newdate = moment().format('L');
		let date = moment(new Date()).format('l');

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
	setAppointmentActive          : async (req, res, next) => {
		console.log('set apppointment active');
		const appointment_id = req.params.appointment_id;

		const appointment = await Appointments.findOneAndUpdate(
			{ _id: appointment_id },
			{ $set: { status: 'inProgress' } },
			{ new: true }
		);
		if (appointment) {
			const data = await getAppointmentData([ appointment ]);
			res.status(200).json({ appointment: data[0] });
		}
	},
	CheckEdit                     : async (req, res, next) => {
		const appointmentId = req.params.appointmentId;
		// const businessId = "5cee375f0d1aca9031f57708";
		// const date = "2019-07-22T21:00:00.000Z";
		// const startMinutes = 25;
		// const startHours = 15;
		// const endMinutes = 50;
		// const endHours = 15;
		const day = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

		const currentAppoointment = await Appointments.findById(appointmentId);

		//console.log("currentAppointment ", currentAppoointment);
		const clientId = currentAppoointment.client_id;
		const businessId = currentAppoointment.business_id;
		const date = currentAppoointment.time.date;
		const dayNum = new Date(date).getDay();
		//console.log("date", date)
		const startMinutes = currentAppoointment.time.start._minute;
		const startHours = currentAppoointment.time.start._hour;
		const endMinutes = currentAppoointment.time.end._minute;
		const endHours = currentAppoointment.time.end._hour;

		//console.log(businessId, date, startHours, startMinutes, endHours, endMinutes)

		const business = await Businesses.find({ _id: businessId }, `break_time working_hours`);

		const todaySch = business[0].working_hours.filter((word) => word.day === day[dayNum]);

		//console.log(todaySch)
		var breakTimeBefore = null;
		var breakTimeAfter = null;
		if (todaySch[0].break.isBreak) {
			//break
			console.log('found BREAK');
			if (
				todaySch[0].break.until.getHours() < startHours &&
				todaySch[0].break.until.getMinutes() < startMinutes
			) {
				breakTimeBefore = todaySch[0].break;
			}
			if (todaySch[0].break.from.getHours() > endHours && todaySch[0].break.from.getMinutes() > endMinutes) {
				breakTimeAfter = todaySch[0].break;
			}
		}

		var today = new Date();
		var todayFlag = 0;
		//console.log("today", today)
		//today.setHours(tomorow.getHours() + 1)
		if (
			today.getDate() == date.getDate() &&
			today.getFullYear() == date.getFullYear() &&
			today.getDay() == date.getDay()
		) {
			todayFlag = 1;
		}

		const appointmentAfterBusiness = await Appointments.find({
			business_id : businessId,
			'time.date' : date,
			$or         : [
				{
					$and : [
						{ 'time.start._hour': { $gte: endHours } },
						{ 'time.start._minute': { $gte: endMinutes } }
					]
				},
				{
					$and : [ { 'time.start._hour': { $gt: endHours } }, { 'time.start._minute': { $gte: 0 } } ]
				}
			]
		})
			.sort([ [ 'time.start._hour', 1 ], [ 'time.start._minute', 1 ] ])
			.limit(1);

		const appointmentBeforeBusiness = await Appointments.find({
			business_id : businessId,
			'time.date' : date,
			$or         : [
				{
					$and : [
						{ 'time.end._hour': { $lte: startHours } },
						{ 'time.end._minute': { $lte: startMinutes } }
					]
				},
				{
					$and : [ { 'time.end._hour': { $lt: startHours } }, { 'time.end._minute': { $lte: 0 } } ]
				}
			]
		})
			.sort([ [ 'time.start._hour', -1 ], [ 'time.start._minute', -1 ] ])
			.limit(1);
		//console.log(appointment[0].time.start._minute)

		///Client Check
		const appointmentBeforeClient = await Appointments.find({
			client_id   : clientId,
			'time.date' : date,
			$or         : [
				{
					$and : [
						{ 'time.end._hour': { $lte: startHours } },
						{ 'time.end._minute': { $lte: startMinutes } }
					]
				},
				{
					$and : [ { 'time.end._hour': { $lt: startHours } }, { 'time.end._minute': { $lte: 0 } } ]
				}
			]
		})
			.sort([ [ 'time.start._hour', -1 ], [ 'time.start._minute', -1 ] ])
			.limit(1);

		const appointmentAfterClient = await Appointments.find({
			client_id   : clientId,
			'time.date' : date,
			$or         : [
				{
					$and : [
						{ 'time.start._hour': { $gte: endHours } },
						{ 'time.start._minute': { $gte: endMinutes } }
					]
				},
				{
					$and : [ { 'time.start._hour': { $gt: endHours } }, { 'time.start._minute': { $gte: 0 } } ]
				}
			]
		})
			.sort([ [ 'time.start._hour', 1 ], [ 'time.start._minute', 1 ] ])
			.limit(1);
		//console.log("business after ", appointmentAfterBusiness, "businessBefore", appointmentBeforeBusiness)

		var appointmentAfter;
		var appointmentBefore;

		if (
			!isEmpty(appointmentAfterBusiness) &&
			!isEmpty(appointmentAfterClient) &&
			!isEmpty(appointmentBeforeBusiness) &&
			!isEmpty(appointmentBeforeClient)
		) {
			const totalStartClient =
				appointmentAfterClient[0].time.start._hour * 60 + appointmentAfterClient[0].time.start._minute;
			const totalStartBusiness =
				appointmentAfterBusiness[0].time.start._hour * 60 + appointmentAfterBusiness[0].time.start._minute;

			const totalEndClient =
				appointmentBeforeClient[0].time.end._hour * 60 + appointmentBeforeClient[0].time.end._minute;
			const totalEndBusiness =
				appointmentBeforeBusiness[0].time.end._hour * 60 + appointmentBeforeBusiness[0].time.end._minute;

			if (totalStartClient > totalStartBusiness) {
				//business wins
				appointmentAfter = appointmentAfterBusiness;
			} else {
				appointmentAfter = appointmentAfterClient;
			}
			if (totalEndClient > totalEndBusiness) {
				//business wins
				appointmentBefore = appointmentBeforeBusiness;
			} else {
				appointmentBefore = appointmentBeforeClient;
			}
		} else if (!isEmpty(appointmentAfterBusiness)) {
			appointmentAfter = appointmentAfterBusiness;
		} else {
			appointmentAfter = appointmentAfterClient;
		}
		if (!isEmpty(appointmentBeforeBusiness)) {
			appointmentBefore = appointmentBeforeBusiness;
		} else {
			appointmentBefore = appointmentBeforeClient;
		}

		//console.log(appointmentAfter, appointmentBefore)
		var TimeAfter = null;
		var TimeBefore = null;
		//console.log(appointment[0].time.start._hour)
		if (!appointmentAfter[0]) {
			if (breakTimeAfter != null) {
				//console.log("!!BreakAfter True AppointmentAfter False", breakTimeAfter)
				TimeAfter =
					breakTimeAfter.from.getHours() * 60 +
					breakTimeAfter.from.getMinutes() -
					(startHours * 60 + startMinutes);
			} else {
				//console.log("BreakAfter False appointmmentAfter False todaySch!!")
				TimeAfter =
					todaySch[0].until.getHours() * 60 +
					todaySch[0].until.getMinutes() -
					(startHours * 60 + startMinutes);
			}
			//todaySch.from
			//console.log(todaySch[0].from.getHours())
		} else {
			if (breakTimeAfter != null) {
				//console.log("BreakAfter true appointmmentafter true")
				if (
					breakTimeAfter.until.getHours() <= appointmentAfter[0].time.start._hour &&
					breakTimeAfter.until.getMinutes() <= appointmentAfter[0].time.start._minute
				) {
					//there is a break between appointmentAfter and current
					//console.log("!!BreakAfter < appointmmentafter")
					TimeAfter =
						breakTimeAfter.from.getHours() * 60 +
						breakTimeAfter.from.getMinutes() -
						(startHours * 60 + startMinutes);
				}
			} else {
				//console.log("BreakAfter !< appointmmentafter!!")

				TimeAfter =
					appointmentAfter[0].time.start._hour * 60 +
					appointmentAfter[0].time.start._minute -
					(startHours * 60 + startMinutes);
			}
		}

		if (!appointmentBefore[0]) {
			if (breakTimeBefore != null) {
				//console.log("!!BreakBefore True AppointmentAfter False")

				if (
					todayFlag &&
					today.getHours() >= breakTimeBefore.until.getHours() &&
					today.getMinutes() >= breakTimeBefore.until.getMinutes()
				) {
					//console.log("today!! > breakTimeBefore")
					TimeBefore = startHours * 60 + startMinutes - (today.getHours() * 60 + today.getMinutes());
				} else {
					//console.log("today < breakTimeBefore!!")
					TimeBefore =
						endHours * 60 +
						endMinutes -
						breakTimeBefore.until.getHours() * 60 +
						breakTimeBefore.until.getMinutes();
				}
			} else {
				if (
					todaySch[0].from.getHours() <= today.getHours() &&
					todaySch[0].from.getMinutes() <= today.getMinutes() &&
					todayFlag
				) {
					//console.log("today")
					TimeBefore = startHours * 60 + startMinutes - (today.getHours() * 60 + today.getMinutes());
				} else {
					//console.log("!!todaySch>today")
					TimeBefore =
						endHours * 60 + endMinutes - (todaySch[0].from.getHours() * 60 + todaySch[0].from.getMinutes());
				}
			}
		} else {
			if (breakTimeBefore != null) {
				if (
					breakTimeBefore.from.getHours() >= appointmentBefore[0].time.start._hour &&
					breakTimeBefore.from.getMinutes() >= appointmentBefore[0].time.start._minute
				) {
					//there is a break between appointmentBefore and current
					//console.log("BreakBefore true")
					if (
						breakTimeBefore.until.getHours() <= today.getHours() &&
						breakTimeBefore.until.getMinutes() <= today.getMinutes() &&
						todayFlag
					) {
						//console.log("breaktimeBEofre<today!! ")
						TimeBefore = startHours * 60 + startMinutes - (today.getHours() * 60 + today.getMinutes());
					} else {
						//console.log("breaktimeBEofre!!>today ")
						TimeBefore =
							startHours * 60 +
							startMinutes -
							(breakTimeBefore.until.getHours() * 60 + breakTimeBefore.until.getMinutes());
					}
				} else {
					//console.log("appointment > ALL Breakbefore True")
					TimeBefore =
						endHours * 60 +
						endMinutes -
						(appointmentBefore[0].time.end._hour * 60 + appointmentBefore[0].time.end._minute);
				}
			} else {
				//console.log("breakBefore false")
				if (
					appointmentBefore[0].time.end._hour <= today.getHours() &&
					appointmentBefore[0].time.end._minute <= today.getMinutes() &&
					todayFlag
				) {
					//console.log("today!! > appointmeentbefore   ")
					TimeBefore = startHours * 60 + startMinutes - (today.getHours() * 60 + today.getMinutes());
				} else {
					//console.log("appointmentBefore >ALL")
					TimeBefore =
						endHours * 60 +
						endMinutes -
						(appointmentBefore[0].time.end._hour * 60 + appointmentBefore[0].time.end._minute);
				}
			}
		}
		const currentAppointmentTime = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
		TimeTotal = TimeAfter + TimeBefore - currentAppointmentTime;

		//console.log({ 'FreeTimeTotal': TimeTotal, 'FreeTimeBefore': TimeBefore, 'FreeTimeAfter': TimeAfter, appointmentBefore, appointmentAfter, currentAppointmentTime })
		//console.log("appoint", currentAppointmentTime)
		res.json({
			FreeTimeTotal     : TimeTotal,
			FreeTimeBefore    : TimeBefore,
			FreeTimeAfter     : TimeAfter,
			appointmentBefore,
			appointmentAfter,
			oldNeededTime     : currentAppointmentTime
		});
	},
	appointmentCheck              : async (req, res, next) => {
		const { appointment_id, client_id, business_id, action, isLate, time } = req.body;
		let query = {};
		let expUpdate = {};
		switch (action) {
			case 'in':
				query = { $set: { status: 'inProgress', 'time.check_in': new Date(time) } };

				if (isLate.late) {
					expUpdate = {
						$inc : { 'customers.$.experiance': -Number(isLate.minutes / 5) }
					};
				} else if (isEmpty(isLate.late)) {
					const alg = await shiftappointmentifpossible(business_id, appointment_id, new Date(time));

					if (alg.ok === true || (alg.ok === false && alg.fixed === true)) {
						/* alg : {
						ok:{true - shifted with no problems , false-check fixed} 
					} 	fixed :{false: no changes will happened, true:{affectedappointmentid: ,}}
						*/
						if (!isEmpty(alg.appointmentnewtimerange)) {
							query = {
								$set : {
									status          : 'inProgress',
									'time.check_in' : new Date(time),
									'time.start'    : {
										_hour   : alg.appointmentnewtimerange._start._hour,
										_minute : alg.appointmentnewtimerange._start._minute
									},
									'time.end'      : {
										_hour   : alg.appointmentnewtimerange._end._hour,
										_minute : alg.appointmentnewtimerange._end._minute
									}
								}
							};
						}
					}
				}
				break;
			case 'out':
				await createReview(appointment_id);
				query = { $set: { status: 'done', 'time.check_out': new Date(time) } };
				sendNotifyReview(appointment_id);
				break;
		}

		/* updating the experince if it's the vustomer is late in check in */
		if (!isEmpty(expUpdate)) {
			const business = await Businesses.findOneAndUpdate(
				{ _id: business_id, 'customers.customer_id': client_id },
				expUpdate
			);
		}
		const appointment = await Appointments.findOneAndUpdate({ _id: appointment_id }, query, { new: true })
			.populate('services')
			.populate('client_id', 'profile');
		if (!appointment) return res.json({ error: 'an error occoured' });

		res.status(200).json({ appointment });
	},
	setCustomerReview             : async (req, res, next) => {
		const { comm, resp, Qos, Vom, feedback, appointment_id, rec } = req.body;
		var avg = (comm + resp + Qos + Vom) / 4;

		let update = {
			$set : {
				customer_review : {
					isRated            : true,
					feedback           : feedback,
					communication      : comm,
					responsiveness     : resp,
					recommend          : rec,
					value_for_money    : Vom,
					quality_of_service : Qos,
					avg_rated          : avg,
					created_time       : new Date()
				}
			}
		};
		const review = await Review.findOneAndUpdate({ appointment_id: appointment_id }, update, {
			new             : true,
			customer_review : 1,
			appointment_id  : 1
		}).populate('appointment_id');
		if (!review) return res.json({ error: 'error accourd' });
		insightsRateIncrement(review.appointment_id.business_id, avg, rec);
		res.status(200).json({ success: 'review saved successffuly' });
	},

	BusinessStatisticsHeader      : async (req, res, next) => {
		let today = moment(new Date()).format('l');

		let id = mongoose.Types.ObjectId(req.params.business_id);

		// const this_month = await Appointments.aggregate([
		// 	{
		// 		$match : {
		// 			business_id : id,
		// 			'time.date' : { $gte: first_of_month, $lt: end_of_month }
		// 		}
		// 	},
		// 	// { $group: { _id: { date: '$time.date', status: '$status' }, count: { $sum: 1 } } },
		// 	{ $group: { _id: { status: '$status' }, count: { $sum: 1 } } },
		// 	{ $project: { count: '$count', status: '$status' } },
		// 	{ $sort: { '_id.date': -1 } }
		// ]);

		// // res.send(this_month);
		// /*  */
		// const saved = new Promise((resolve) => {
		// 	this_month.map((result) => {
		// 		// const arrKey = new Date(result._id.date).getTime();
		// 		const arrKey = id;

		// 		if (!allData[arrKey]) {
		// 			allData[arrKey] = {
		// 				ready           : 0,
		// 				inProgress      : 0,
		// 				pendingClient   : 0,
		// 				pendingBusiness : 0,
		// 				passed          : 0,
		// 				canceled        : 0,
		// 				total           : 0,
		// 				done            : 0,
		// 				date            : ''
		// 			};
		// 		}
		// 		allData[arrKey].total += result.count;
		// 		allData[arrKey].date = result._id.date;
		// 		allData[arrKey][result._id.status] += result.count;
		// 	});
		// 	resolve(allData);
		// }).then((statistics) => {
		// 	res.status(200).json({ statistics });
		// });
	},
	setBusinessReview             : async (req, res, next) => {
		const { communication, responsiveness, overall, time_respect, feedback, appointment_id } = req.body;
		let avg = (communication + responsiveness + overall + time_respect) / 4;
		let exp = -1;

		let update = {
			$set : {
				business_review : {
					isRated        : true,
					feedback       : feedback,
					communication,
					responsiveness,
					overall,
					time_respect,
					avg_rated      : avg,
					created_time   : new Date()
				}
			}
		};
		const review = await Review.findOneAndUpdate({ appointment_id: appointment_id }, update, {
			new             : true,
			business_review : 1,
			appointment_id  : 1
		}).populate('appointment_id');
		if (!review) return res.json({ error: 'error accourd' });
		if (avg > 3) {
			exp = avg;
		}
		const business = await Businesses.findOneAndUpdate(
			{
				_id                     : review.appointment_id.business_id,
				'customers.customer_id' : review.appointment_id.client_id
			},
			{
				$inc : { 'customers.$.experiance': exp }
			}
		);

		res.status(200).json({ success: 'review saved successffuly' });
	},
	getReviewByBusinessId         : async (req, res, next) => {
		const reviews = await Appointments.find({ business_id: req.params.business_id, status: 'done' })
			.populate('review')
			.populate('client_id', 'profile')
			.populate('services', 'title')
			.sort({ 'time.check_out': -1, 'time.start._hour': -1, 'time.start.minute': -1 });

		if (!reviews) return res.json({ error: 'some error found during fetching' });

		res.status(200).json({ reviews });
	},

	getReviewAsCustomer           : async (req, res, next) => {
		const reviews = await Appointments.find({ client_id: req.user._id, status: 'done' })
			.populate('review', 'customer_review')
			// .populate('client_id', 'profile')
			.populate('business_id', 'profile')
			.populate('services', 'title')
			.sort({ 'time.check_out': -1, 'time.start._hour': -1, 'time.start.minute': -1 });

		if (!reviews) return res.json({ error: 'some error found during fetching' });

		res.status(200).json({ reviews });
	},
	createReviews                 : async (req, res, next) => {
		console.log('inside the reviews');
		const appointments = await Appointments.find({ status: 'done' });

		const elem = await appointments.map((appoitnemnt) => {
			let id = appoitnemnt._id;
			return new Review({
				_id            : new mongoose.Types.ObjectId(),
				appointment_id : mongoose.Types.ObjectId(id)
			});
		});
		const result = await Review.insertMany(elem);

		if (result) res.json({ done: 'done' });
	},

	getIsRated                    : async (req, res, next) => {
		const thisReview = await Review.findOne({
			appointment_id            : req.params.appointmentId,
			'customer_review.isRated' : false
		});

		if (thisReview) res.status(200).json({ success: true, thisReview });
		res.status(202).json({ success: false });
	},

	getReviewByAppointment        : async (req, res, next) => {
		const { appointment_id } = req.params;
		const review = await Review.findOne({ appointment_id: appointment_id }, '-customer_review').populate({
			path     : 'appointment_id',
			populate : [ { path: 'services', select: 'title' }, { path: 'client_id', select: 'profile' } ]
		});

		if (!review) return res.json({ error: 'Review Not Found' });
		if (review.business_review.isRated) return res.json({ error: " you can't review same appointment twice" });
		res.status(200).json({ review });
	}

	// BusinessStatisticsHeader      : async (req, res, next) => {
	// 	let allData = {};
	// 	let first_of_month = moment().startOf('month').toDate();
	// 	let end_of_month = moment().startOf('month').add(1, 'M').toDate();
	// 	// .endOf('month').toDate();

	// 	let id = mongoose.Types.ObjectId(req.params.business_id);

	// 	const this_month = await Appointments.aggregate([
	// 		{
	// 			$match : {
	// 				business_id : id,
	// 				'time.date' : { $gte: first_of_month, $lt: end_of_month }
	// 			}
	// 		},
	// 		{ $group: { _id: { date: '$time.date', status: '$status' }, count: { $sum: 1 } } },
	// 		// { $group: { _id: { status: '$status' }, count: { $sum: 1 } } },
	// 		{ $project: { count: '$count', status: '$status' } },
	// 		{ $sort: { '_id.date': -1 } }
	// 	]);

	// 	// res.send(this_month);
	// 	/*  */
	// 	const saved = new Promise((resolve) => {
	// 		this_month.map((result) => {
	// 			const arrKey = new Date(result._id.date).getTime();
	// 			// const arrKey = id;

	// 			if (!allData[arrKey]) {
	// 				allData[arrKey] = {
	// 					ready           : 0,
	// 					inProgress      : 0,
	// 					pendingClient   : 0,
	// 					pendingBusiness : 0,
	// 					passed          : 0,
	// 					canceled        : 0,
	// 					total           : 0,
	// 					done            : 0,
	// 					date            : ''
	// 				};
	// 			}
	// 			allData[arrKey].total += result.count;
	// 			allData[arrKey].date = result._id.date;
	// 			allData[arrKey][result._id.status] += result.count;
	// 		});
	// 		resolve(allData);
	// 	}).then((statistics) => {
	// 		res.status(200).json({ statistics });
	// 	});
	// }
};

const getAppointmentData = async (appointments) => {
	var data = [];
	for (let appointment of appointments) {
		const user = await Users.findById(appointment.client_id, 'profile.name');
		// const business = await Businesses.findById(appointment.business_id);

		const Nservices = await Categories.find({
			'services._id' : { $in: appointment.services }
		});
		const services = await getServices(Nservices, appointment.services);
		await data.push({
			_id         : appointment._id,
			business_id : appointment.business_id,
			client      : user,
			time        : {
				date  : appointment.time.date,
				start : appointment.time.start,
				end   : appointment.time.end
			},
			services    : services,
			status      : appointment.status
		});
	}
	return await data;
};
