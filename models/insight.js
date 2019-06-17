const Review = require('../models/review');
const moment = require('moment');

var mongoose = require('mongoose'),
	insight = new mongoose.Schema({
		business_id        : { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
		date               : {
			type    : Date,
			default : new Date(moment().format('YYYY/MM/DD'))
		},
		rating_sum         : {
			type    : Number,
			default : 0
		},
		rating_count       : {
			type    : Number,
			default : 0
		},
		recommendation_sum : {
			type    : Number,
			default : 0
		},
		profile_views      : {
			type    : Number,
			default : 0
		}
	});

var Insight = mongoose.model('Insight', insight);

module.exports = Insight;
