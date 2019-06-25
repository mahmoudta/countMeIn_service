const mongoose = require('mongoose');
const Reviews = require('../../models/review');
const Business = require('../../models/business');

const Appointments = require('../../models/appointment');
const Insights = require('../../models/insight');
const isEmpty = require('lodash.isempty');
const moment = require('moment');

module.exports.getbusinessAvgRatingByDateRange = async (business_id, from = false, until = false) => {
	/* if until and from === false then for all the time */
	let query = {};
	if (!until && from) {
		query = {
			business_id : business_id,
			'time.date' : { $gt: new Date(from) },
			status      : 'done'
		};
	} else if (!until && !from) {
		query = {
			business_id : business_id,
			status      : 'done'
		};
	} else {
		query = {
			business_id : business_id,
			status      : 'done',
			'time.date' : { $gt: new Date(from), $lt: new Date(until) }
		};
	}

	const reviews = await Reviews.find({ 'business_review.isRated': true }).populate('appointment_id');

	// const filtered = await reviews.filter
	// const appointments = await Appointments.find(query).populate({
	// 	path   : 'review',
	// 	$match : { 'customer_review.isRated': true }
	// });

	// const items = await newAppointments.map((app, i) => {
	// 	console.log(i);
	// });

	return await reviews;
};

/* this function will run after the review an appointment (customer review) */

module.exports.businessRateIncrement = (business_id, update, options) => {
	var new_update = {
		$inc : {
			'profile.rating.rating_count'       : 1,
			'profile.rating.rating_sum'         : update.avg_rate,
			'profile.rating.recommendation_sum' : update.recommend ? 1 : 0
		}
	};

	Business.findOneAndUpdate({ _id: business_id }, new_update, options).exec();
};
module.exports.unFollowClickIncerement = (business_id) => {
	const date = new Date(moment().format('YYYY/MM/DD'));
	var query = { business_id: business_id, date: date },
		update = { $inc: { unfollow: 1 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };
	Insights.findOneAndUpdate(query, update, options).exec();
};

module.exports.followClickIncrement = (business_id) => {
	const date = new Date(moment().format('YYYY/MM/DD'));
	var query = { business_id: business_id, date: date },
		update = { $inc: { follow: 1 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };
	Insights.findOneAndUpdate(query, update, options).exec();
};

module.exports.insightsRateIncrement = (business_id, avg_rate, recommend) => {
	const date = new Date(moment().format('YYYY/MM/DD'));

	var query = { business_id: business_id, date: date },
		update = { $inc: { rating_count: 1, rating_sum: avg_rate, recommendation_sum: recommend ? 1 : 0 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Insights.findOneAndUpdate(query, update, options).exec();
	this.businessRateIncrement(business_id, { avg_rate, recommend }, options);
};

module.exports.profileViewIncerement = (business_id) => {
	const date = new Date(moment().format('YYYY/MM/DD'));

	var query = { business_id: business_id, date: date },
		update = { $inc: { profile_views: 1 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Insights.findOneAndUpdate(query, update, options).exec();
};

module.exports.createReview = async (appointment_id) => {
	return await new Reviews({
		_id            : new mongoose.Types.ObjectId(),
		appointment_id : mongoose.Types.ObjectId(appointment_id)
	}).save();
};

module.exports.createInsights = async (appointment_id) => {
	const businesses = await Business.find({});
	const start = moment().subtract(29, 'days');
	const end = moment();
	var options = { upsert: true, new: true, setDefaultsOnInsert: true };

	let date = start;
	let i = 1;
	while (date >= start) {
		date = end.subtract(i, 'days');
		console.log(date.format('YYYY/MM/DD'));
		await businesses.forEach(async (business) => {
			var query = {
					business_id : mongoose.Types.ObjectId('5cedfa110a209a0eddbb2bbb'),
					date        : new Date(date.format('YYYY/MM/DD'))
				},
				update = {};

			const z = await Insights.findOneAndUpdate(query, update, options);
			i += 1;
		});
	}
};
module.exports.servicesDayStatistics = async () => {
	const results = await Appointments.aggregate([
		//TODO - ADD to pipleine to avoid double quers
		{ $match: { status: 'done' } },
		{ $unwind: '$services' },
		/* stage to save the service_id before the join */
		{
			$addFields : {
				mainService : '$services'
			}
		},
		/* stage to join from business with the service to get the cost and the time */
		{
			$lookup : {
				from         : 'businesses',
				localField   : 'services',
				foreignField : 'services.service_id',
				as           : 'services'
			}
		},
		/* stage to to get the join services[0]{which it a document of join and save it as a real document} */
		{
			$addFields : {
				allservices : { $arrayElemAt: [ '$services', 0 ] }
			}
		},
		/* the stage to filter the results and keep the wanted varibales only */
		{
			$project : {
				date        : '$time.date',
				business_id : '$business_id',
				services    : {
					$filter : {
						input : '$allservices.services',
						as    : 'item',
						cond  : {
							$eq : [ '$$item.service_id', '$mainService' ]
						}
					}
				}
			}
		},
		{ $unwind: '$services' },

		{
			$group : {
				_id      : {
					date        : '$date',
					business_id : '$business_id'
				},

				services : { $push: '$services' },
				count    : { $sum: 1 }
			}
		},

		{
			$project : {
				_id               : 0,
				business_id       : '$_id.business_id',
				date              : '$_id.date',
				total_earnings    : { $sum: '$services.cost' },
				total_time        : { $sum: '$services.time' },
				done_appointments : '$count'
			}
		}
	]);
	var options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

	// const date = new Date(moment().format('YYYY/MM/DD'));
	await results.forEach(async (result) => {
		var query = { business_id: result.business_id, date: result.date },
			update = {
				$set : {
					total_earnings    : result.total_earnings,
					total_time        : result.total_time,
					done_appointments : result.done_appointments
				}
			};
		await Insights.findOneAndUpdate(query, update, options).exec();
	});
};

module.exports.createAppointmentsInsights = async () => {
	const results = await Appointments.aggregate([
		{
			$addFields : {
				hour   : '$time.start._hour',

				done   : { $cond: [ { $eq: [ '$status', 'done' ] }, 1, 0 ] },
				passed : { $cond: [ { $eq: [ '$status', 'passed' ] }, 1, 0 ] }
			}
		},
		{
			$group : {
				_id    : {
					date        : '$time.date',
					business_id : '$business_id',
					time        : '$hour'
				},
				total  : { $sum: 1 },
				done   : { $sum: '$done' },
				passed : { $sum: '$passed' }
			}
		},
		{
			$group : {
				_id                 : {
					date        : '$_id.date',
					business_id : '$_id.business_id'
				},
				total_appointments  : { $sum: '$total' },
				done_appointments   : { $sum: '$done' },
				passed_appointments : { $sum: '$passed' },
				traffic             : { $push: { time: '$_id.time', count: { $sum: '$total' } } }
			}
		}
	]);

	var options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

	// const date = new Date(moment().format('YYYY/MM/DD'));
	await results.forEach(async (result) => {
		var query = { business_id: result._id.business_id, date: result._id.date },
			update = {
				$set : {
					total_appointments  : result.total_appointments,
					done_appointments   : result.done_appointments,
					passed_appointments : result.passed_appointments,
					traffic             : result.traffic
				}
			};
		await Insights.findOneAndUpdate(query, update, options).exec();
	});
};

module.exports.createTotalFollowersCount = async () => {
	const results = await Business.aggregate([
		{ $unwind: '$customers' },
		{ $match: { 'customers.isFollower': true } },
		{
			$group : {
				_id   : '$_id',
				count : { $sum: 1 }
			}
		}
	]);
	let date = moment(new Date()).subtract(1, 'day').format('l');
	var options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

	// const date = new Date(moment().format('YYYY/MM/DD'));
	await results.forEach(async (result) => {
		var query = { business_id: result._id },
			update = {
				$set : {
					total_followers : result.count
				}
			};
		const wait = await Insights.updateMany(query, update, options).exec();
	});

	return results;
};
