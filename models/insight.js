const Review = require('../models/review');
const moment = require('moment');

var mongoose = require('mongoose'),
	insight = new mongoose.Schema({
		business_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
		date                : {
			type    : Date,
			default : new Date(moment().format('YYYY/MM/DD'))
		},
		rating_sum          : {
			type    : Number,
			default : 0
		},
		rating_count        : {
			type    : Number,
			default : 0
		},
		recommendation_sum  : {
			type    : Number,
			default : 0
		},
		profile_views       : {
			type    : Number,
			default : 0
		},
		follow              : {
			type    : Number,
			default : 0
		},
		unfollow            : {
			type    : Number,
			default : 0
		},
		total_followers     : {
			type    : Number,
			default : 0
		},
		total_earnings      : {
			type    : Number,
			default : 0
		},
		total_time          : {
			type    : Number,
			default : 0
		},
		done_appointments   : {
			type    : Number,
			default : 0
		},
		passed_appointments : {
			type    : Number,
			default : 0
		},
		total_appointments  : {
			type    : Number,
			default : 0
		},
		traffic             : [
			{
				time  : Number,
				count : Number
			}
		]
	});

var Insight = mongoose.model('Insight', insight);

module.exports = Insight;
