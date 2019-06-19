const mongoosePaginate = require('mongoose-paginate-v2');

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
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			isRated        : {
				type    : Boolean,
				default : false
			}
		},
		customer_review : {
			created_time       : {
				type    : Date,
				default : Date.now
			},
			isRated            : {
				type    : Boolean,
				default : false
			},
			anynomus           : {
				type    : Boolean,
				default : false
			},
			communication      : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			responsiveness     : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			quality_of_service : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			value_for_money    : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			avg_rated          : {
				type    : Number,
				max     : 5,
				min     : 1,
				default : 1
			},
			recommend          : {
				type    : Boolean,
				default : false
			},
			feedback           : {
				type    : String,
				default : ''
			}
		}
	});
review.plugin(mongoosePaginate);
var Review = mongoose.model('Review', review);

module.exports = Review;
