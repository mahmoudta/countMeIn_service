var mongoose = require('mongoose'),
	review = new mongoose.Schema({
		_id             : { type: mongoose.Schema.Types.ObjectId },
		appointment_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
		business_review : {
			created_time : {
				type    : Date,
				default : Date.now
			}
		}
	});

var Review = mongoose.model('Review', review);

module.exports = Review;
