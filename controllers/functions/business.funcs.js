const Appointments = require('../../models/appointment');
const Reviews = require('../../models/review');
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
module.exports.rateIncrement = (business_id) => {
	const date = new Date(moment().format('YYYY/MM/DD'));

	var query = { business_id: business_id, date: date },
		update = { $inc: { rating_count: 1 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Insights.findOneAndUpdate(query, update, options).exec().then((res) => {
		console.log(res);
	});

	// console.log(date);
};

module.exports.profileViewIncerement = (business_id) => {
	const date = new Date(moment().format('YYYY/MM/DD'));

	var query = { business_id: business_id, date: date },
		update = { $inc: { profile_views: 1 } },
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Insights.findOneAndUpdate(query, update, options).exec().then((res) => {
		console.log(res);
	});

	// console.log(date);
};
