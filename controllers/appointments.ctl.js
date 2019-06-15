const JWT = require('jsonwebtoken');
const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');
const Review = require('../models/review');

const { JWT_SECRET } = require('../consts');
// const { freeTimeAlg } = require('./algs/free-alg');

const { booked, deleted, shiftappointmentifpossible } = require('./algs/free-alg');
const { getServices } = require('../utils/appointment.utils');
const mongoose = require('mongoose');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');

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
			.sort({ 'time.start._hour': 1, 'time.start.minute': 1 })
			.populate('client_id', 'profile')
			.populate('services', 'title')
			.populate('review', 'business_review');

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
		const { appointment_id, client_id, business_id, action, isLate, time } = req.body;
		let query = {};
		let expUpdate = {};
		switch (action) {
			case 'in':
				if (isLate.late) {
					expUpdate = {
						$inc : { 'customers.$.experiance': -Number(isLate.minutes / 5) }
					};
				} else if (isEmpty(isLate.late)) {
					query = { $set: { status: 'inProgress', 'time.check_in': new Date(time) } };
					const alg = await shiftappointmentifpossible(business_id, appointment_id, new Date(time));
					if (alg.ok === true || (alg.ok === false && alg.fixed === true)) {
						/* alg : {
						ok:{true - shifted with no problems , false-check fixed} 
					} 	fixed :{false: no changes will happened, true:{affectedappointmentid: ,}}
						*/
						query = {
							$set : {
								status          : 'inProgress',
								'time.check_in' : new Date(time),
								'time.start'    : {
									_hour   : alg.appointmentnewtimerange._start._hour,
									_minute : alg.appointmentnewtimerange._start._minute
								},
								'time.end'      : {
									_hour   : alg.appointmentnewtimerange._start._hour,
									_minute : alg.appointmentnewtimerange._start._minute
								}
							}
						};
					}
				}
				break;
			case 'out':
				query = { $set: { status: 'done', 'time.check_out': new Date(time) } };
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
	BusinessStatisticsHeader      : async (req, res, next) => {
		let allData = {};
		let first_of_month = moment().startOf('month').toDate();
		let end_of_month = moment().startOf('month').add(1, 'M').toDate();
		// .endOf('month').toDate();

		let id = mongoose.Types.ObjectId(req.params.business_id);

		const this_month = await Appointments.aggregate([
			{
				$match : {
					business_id : id,
					'time.date' : { $gte: first_of_month, $lt: end_of_month }
				}
			},
			// { $group: { _id: { date: '$time.date', status: '$status' }, count: { $sum: 1 } } },
			{ $group: { _id: { status: '$status' }, count: { $sum: 1 } } },
			{ $project: { count: '$count', status: '$status' } },
			{ $sort: { '_id.date': -1 } }
		]);

		// res.send(this_month);
		/*  */
		const saved = new Promise((resolve) => {
			this_month.map((result) => {
				// const arrKey = new Date(result._id.date).getTime();
				const arrKey = id;

				if (!allData[arrKey]) {
					allData[arrKey] = {
						ready           : 0,
						inProgress      : 0,
						pendingClient   : 0,
						pendingBusiness : 0,
						passed          : 0,
						canceled        : 0,
						total           : 0,
						done            : 0,
						date            : ''
					};
				}
				allData[arrKey].total += result.count;
				allData[arrKey].date = result._id.date;
				allData[arrKey][result._id.status] += result.count;
			});
			resolve(allData);
		}).then((statistics) => {
			res.status(200).json({ statistics });
		});
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
	// createReviews                 : async (req, res, next) => {
	// 	const appointments = await Appointments.find({}).populate('review');

	// 	res.json({ appointments });
	// }

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
