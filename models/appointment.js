var mongoose = require('mongoose'),
	appointment = new mongoose.Schema({
		business_id: String,
		client_id: String,
		time: {
			date: Date,
			start: {
				_hour: Number,
				_minute: Number
			},
			end: {
				_hour: Number,
				_minute: Number
			}
		},
		services: [ String ],
		status: {
			type: String,
			enum: [ 'done', 'pendingClient', 'pendingBusiness', 'passed', 'ready' ],
			default: 'ready'
		}
		/*
		feedback:{
			clinet:
			business:
		}
		*/
	});

var Appointment = mongoose.model('Appointment', appointment);

module.exports = Appointment;
