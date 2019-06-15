var mongoose = require('mongoose'),
	review = new mongoose.Schema({
		_id             : { type: mongoose.Schema.Types.ObjectId },
		appointment_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
		business_review : {
			created_time   : {
				type    : Date,
				default : Date.now
			},
			overall        : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			communication  : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			responsiveness : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			time_respect   : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			feedback       : {
				type    : String,
				default : ''
			},
			avg_rated      : {
				max     : 5,
				min     : 1,
				default : 1
			},
			isReated       : {
				type    : Boolean,
				default : false
			}
		},
		customer_review : {}
	});

var Review = mongoose.model('Review', review);

module.exports = Review;
