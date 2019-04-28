var mongoose = require('mongoose'),
	appointment = new mongoose.Schema({
		business_id: String,
		client_id: String,
		time: {
			date: Date,
			start: {
				hours: 0,
				minutes: 0
			},
			end: {
				hours: 0,
				minuutes: 0
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
