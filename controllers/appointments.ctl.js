const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');

const { JWT_SECRET } = require('../consts');
// const { freeTimeAlg } = require('./algs/free-alg');
const { booked, deleted } = require('./algs/free-alg');
const { getServices, CheckBeforeEdit } = require('../utils/appointment.utils');
const mongoose = require('mongoose');

module.exports = {
	setAppointment: async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		console.log(newDate);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);
		console.log(newDate);

		const newAppointment = new Appointments(
			{
				_id: new mongoose.Types.ObjectId(),
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
				services: service
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
			_start: newAppointment.time.start,
			_end: newAppointment.time.end
		});
		res.status(200).json('suceess');
	},

	setAppointmentAndDelete: async (req, res, next) => {
		const { businessId, costumerId, service, date, shour, sminute, ehour, eminute, appointmentId } = req.body;
		//console.log(sstart);

		var newDate = new Date(date);
		console.log(newDate);
		const hhours = Number(ehour) - Number(shour);
		const mminutes = Number(eminute) - Number(sminute);
		console.log(newDate);

		const newAppointment = new Appointments(
			{
				_id: new mongoose.Types.ObjectId(),
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
				services: service
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
			_start: newAppointment.time.start,
			_end: newAppointment.time.end
		});

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
			_start: {
				_hour: Number(thisAppointment.time.start._hour),
				_minute: Number(thisAppointment.time.start._minute)
			},
			_end: {
				_hour: Number(thisAppointment.time.end._hour),
				_minute: Number(thisAppointment.time.end._minute)
			}
		});
		res.status(200).json('suceess');
	},

	deleteAppointment: async (req, res, next) => {
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
			_start: {
				_hour: Number(thisAppointment.time.start._hour),
				_minute: Number(thisAppointment.time.start._minute)
			},
			_end: {
				_hour: Number(thisAppointment.time.end._hour),
				_minute: Number(thisAppointment.time.end._minute)
			}
		});
		console.log(del);
		res.json({ QueryRes });
	},

	getClientsAppointments: async (req, res, next) => {
		//getmyappointment for clients
		const QueryRes = await Appointments.find({
			client_id: req.params.clientId
		});
		res.json({ QueryRes });
	},

	getBusinessAppointments: async (req, res, next) => {
		const appointments = await Appointments.find({
			business_id: req.params.businessId
		}).sort({ 'time.date': 1 });
		res.json({ appointments });
	},

	getSubCategories: async (req, res, next) => {
		const QueryRes = await Businesses.findById(req.params.businessId, 'profile.purposes', function (err, usr) { });
		console.log(req.params.businessId);

		//const subCategories = await Categories.findOne(category._id);

		res.status(200).json({ QueryRes });
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
		const appointments = await Appointments.find({
			business_id: business_id,
			'time.date': Ndate
		})
			.populate('client_id', 'profile')
			.populate('services', 'title');
		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		const data = await getAppointmentData(appointments);
		return res.json({ appointments: data });
	},
	getTodaysReadyAppointments: async (req, res, next) => {
		const dateNow = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);

		dateNow.setUTCHours(21, 0, 0, 0);
		console.log(dateNow);
		// dateNow.setUTCHours(21, 0, 0, 0);
		// console.log(dateNow);
		const appointments = await Appointments.find({
			business_id: req.params.business_id,
			// 'time.date': {
			// 	$gte: dateNow
			// },
			'time.date': dateNow,
			status: 'ready'
		})
			.limit(5)
			.sort({ 'time.start._hour': 1, 'time.start.minute': 1 });
		// .sort(appointment_a,appointmentb)=>{
		// 	let time_a = new Date(appointment.time.start._hour,appointment.time.start._minute,0,0);
		// 	return time_a < time_b;
		// });
		if (!appointments) return res.status(403).json({ error: 'an error occoured' });

		const data = await getAppointmentData(appointments);
		return res.status(200).json({ appointments: data });
	},
	setAppointmentActive: async (req, res, next) => {
		console.log('set apppointment active');
		const appointment_id = req.params.appointment_id;

		const appointment = await Appointments.findOneAndUpdate(
			{ _id: appointment_id },
			{ $set: { status: 'inProgress' } },
			{ new: true }
		);
		if (appointment) {
			const data = await getAppointmentData([appointment]);
			res.status(200).json({ appointment: data[0] });
		}
	},

	CheckEdit: async (req, res, next) => {
		const appointmentId = req.params.appointmentId;
		// const businessId = "5cee375f0d1aca9031f57708";
		// const date = "2019-07-22T21:00:00.000Z";
		// const startMinutes = 25;
		// const startHours = 15;
		// const endMinutes = 50;
		// const endHours = 15;
		const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']


		const currentAppoointment = await Appointments.findById(appointmentId);

		//console.log("currentAppointment ", currentAppoointment);

		const businessId = currentAppoointment.business_id;
		const date = currentAppoointment.time.date;
		const dayNum = new Date(date).getDay()
		console.log("date", date)
		const startMinutes = currentAppoointment.time.start._minute;
		const startHours = currentAppoointment.time.start._hour;
		const endMinutes = currentAppoointment.time.end._minute;
		const endHours = currentAppoointment.time.end._hour;


		//console.log(businessId, date, startHours, startMinutes, endHours, endMinutes)




		const business = await Businesses.find({ '_id': businessId }, `break_time working_hours`);

		const todaySch = business[0].working_hours.filter(word => word.day === day[dayNum]);

		console.log(todaySch)
		var breakTimeBefore = null;
		var breakTimeAfter = null;
		if (todaySch[0].break.isBreak) {
			//break
			console.log("found BREAK")
			if (todaySch[0].break.until.getHours() < startHours && todaySch[0].break.until.getMinutes() < startMinutes) {
				breakTimeBefore = todaySch[0].break;
			} if (todaySch[0].break.from.getHours() > endHours && todaySch[0].break.from.getMinutes() > endMinutes) {
				breakTimeAfter = todaySch[0].break;
			}

		}



		var today = new Date();
		var todayFlag = 0;
		console.log("today", today)
		//today.setHours(tomorow.getHours() + 1)
		if (today.getDate() == date.getDate() && today.getFullYear() == date.getFullYear() && today.getDay() == date.getDay()) {
			todayFlag = 1;
		}



		const appointmentAfter = await Appointments.find({
			business_id: businessId, 'time.date': date,
			$or: [
				{
					$and: [
						{ 'time.start._hour': { '$gte': endHours } }
						, { 'time.start._minute': { '$gte': endMinutes } }]
				}
				, {
					$and: [
						{ 'time.start._hour': { '$gt': endHours } }
						, { 'time.start._minute': { '$gte': 0 } }]
				}
			]
		}).sort([['time.start._hour', 1], ['time.start._minute', 1]]).limit(1)


		const appointmentBefore = await Appointments.find({
			business_id: businessId, 'time.date': date,
			$or: [
				{
					$and: [
						{ 'time.end._hour': { '$lte': startHours } }
						, { 'time.end._minute': { '$lte': startMinutes } }]
				}
				, {
					$and: [
						{ 'time.end._hour': { '$lt': startHours } }
						, { 'time.end._minute': { '$lte': 0 } }]
				}
			]
		}).sort([['time.start._hour', -1], ['time.start._minute', -1]]).limit(1)
		//console.log(appointment[0].time.start._minute)
		var TimeAfter = null;
		var TimeBefore = null;
		//console.log(appointment[0].time.start._hour)
		if (!appointmentAfter[0]) {
			if (breakTimeAfter != null) {
				console.log("!!BreakAfter True AppointmentAfter False", breakTimeAfter)
				TimeAfter = (((breakTimeAfter.from.getHours() * 60) + breakTimeAfter.from.getMinutes()) - (startHours * 60 + startMinutes))
			} else {
				console.log("BreakAfter False appointmmentAfter False todaySch!!")
				TimeAfter = (((todaySch[0].until.getHours() * 60) + todaySch[0].until.getMinutes()) - (startHours * 60 + startMinutes))
			}
			//todaySch.from
			//console.log(todaySch[0].from.getHours())
		} else {
			if (breakTimeAfter != null) {
				console.log("BreakAfter true appointmmentafter true")
				if (breakTimeAfter.until.getHours() <= appointmentAfter[0].time.start._hour && breakTimeAfter.until.getMinutes() <= appointmentAfter[0].time.start._minute) {
					//there is a break between appointmentAfter and current
					console.log("!!BreakAfter < appointmmentafter")
					TimeAfter = (((breakTimeAfter.from.getHours() * 60) + breakTimeAfter.from.getMinutes()) - (startHours * 60 + startMinutes))
				}
			} else {
				console.log("BreakAfter !< appointmmentafter!!")

				TimeAfter = (((appointmentAfter[0].time.start._hour * 60) + appointmentAfter[0].time.start._minute) - (startHours * 60 + startMinutes))
			}
		}

		if (!appointmentBefore[0]) {
			if (breakTimeBefore != null) {
				console.log("!!BreakBefore True AppointmentAfter False")

				if (todayFlag && today.getHours() >= breakTimeBefore.until.getHours() && today.getMinutes() >= breakTimeBefore.until.getMinutes()) {
					console.log("today!! > breakTimeBefore")
					TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))

				} else {
					console.log("today < breakTimeBefore!!")
					TimeBefore = (((endHours * 60) + endMinutes) - breakTimeBefore.until.getHours() * 60 + breakTimeBefore.until.getMinutes())
				}
			} else {
				if (todaySch[0].from.getHours() <= today.getHours() && todaySch[0].from.getMinutes() <= today.getMinutes() && todayFlag) {
					console.log("today")
					TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))
				} else {
					console.log("!!todaySch>today")
					TimeBefore = (((endHours * 60) + endMinutes) - (todaySch[0].from.getHours() * 60 + todaySch[0].from.getMinutes()))

				}
			}

		} else {
			if (breakTimeBefore != null) {
				if (breakTimeBefore.from.getHours() >= appointmentBefore[0].time.start._hour && breakTimeBefore.from.getMinutes() >= appointmentBefore[0].time.start._minute) {
					//there is a break between appointmentBefore and current
					console.log("BreakBefore true")
					if (breakTimeBefore.until.getHours() <= today.getHours() && breakTimeBefore.until.getMinutes() <= today.getMinutes() && todayFlag) {
						console.log("breaktimeBEofre<today!! ")
						TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))
					} else {
						console.log("breaktimeBEofre!!>today ")
						TimeBefore = ((startHours * 60 + startMinutes) - ((breakTimeBefore.until.getHours() * 60) + breakTimeBefore.until.getMinutes()))
					}
				} else {
					console.log("appointment > ALL Breakbefore True")
					TimeBefore = (((endHours * 60) + endMinutes) - ((appointmentBefore[0].time.end._hour * 60) + appointmentBefore[0].time.end._minute))
				}

			} else {
				console.log("breakBefore false")
				if (appointmentBefore[0].time.end._hour <= today.getHours() && appointmentBefore[0].time.end._minute <= today.getMinutes() && todayFlag) {
					console.log("today!! > appointmeentbefore   ")
					TimeBefore = ((startHours * 60 + startMinutes) - ((today.getHours() * 60) + today.getMinutes()))

				} else {
					console.log("appointmentBefore >ALL")
					TimeBefore = (((endHours * 60) + endMinutes) - ((appointmentBefore[0].time.end._hour * 60) + appointmentBefore[0].time.end._minute))

				}
			}

		}
		const currentAppointmentTime = (((endHours * 60) + endMinutes) - ((startHours * 60) + startMinutes))
		TimeTotal = TimeAfter + TimeBefore - currentAppointmentTime;

		console.log({ 'FreeTimeTotal': TimeTotal, 'FreeTimeBefore': TimeBefore, 'FreeTimeAfter': TimeAfter, appointmentBefore, appointmentAfter, currentAppointmentTime })
		//console.log("appoint", currentAppointmentTime)
		res.json({ 'FreeTimeTotal': TimeTotal, 'FreeTimeBefore': TimeBefore, 'FreeTimeAfter': TimeAfter, appointmentBefore, appointmentAfter, oldNeededTime: currentAppointmentTime })

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
	for (let appointment of appointments) {
		const user = await Users.findById(appointment.client_id, 'profile.name');
		// const business = await Businesses.findById(appointment.business_id);

		const Nservices = await Categories.find({
			'services._id': { $in: appointment.services }
		});
		const services = await getServices(Nservices, appointment.services);
		await data.push({
			_id: appointment._id,
			business_id: appointment.business_id,
			client: user,
			time: {
				date: appointment.time.date,
				start: appointment.time.start,
				end: appointment.time.end
			},
			services: services,
			status: appointment.status
		});
	}
	return await data;
};
