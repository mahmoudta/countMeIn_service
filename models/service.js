const Categories = require('./category');
const mongoose = require('mongoose'),
	service = new mongoose.Schema({
		_id: { type: mongoose.Schema.Types.ObjectId },
		parent_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
		title: {
			type: String,
			lowercase: true,
			trim: true,
			required: true
		},
		time: {
			/* 
         *   time specified with minutes  
         *   minimum time for purpose is 10 min maximum 2 hours
         */
			type: Number,
			min: 10,
			max: 120,
			required: true
		},
		cost: {
			type: Number,
			min: 0,
			default: 0
		}
	});

var Service = mongoose.model('Service', service);

module.exports = Service;
