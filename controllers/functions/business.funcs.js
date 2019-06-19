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

module.exports.servicesDayStatistics = async () => {
	const result = await Appointments.aggregate([
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
				_id         : 0,
				business_id : '$_id.business_id',
				date        : '$_id.date',
				totalCost   : { $sum: '$services.cost' },
				totalTime   : { $sum: '$services.time' },
				count       : '$count'
			}
		}
	]);
};
