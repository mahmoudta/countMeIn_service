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
			enum: [ 'ready', 'inProgress', 'done', 'pendingClient', 'pendingBusiness', 'passed', 'canceled' ],
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
