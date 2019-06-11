var mongoose = require('mongoose'),
	appointment = new mongoose.Schema({
		_id         : { type: mongoose.Schema.Types.ObjectId },
		business_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
		client_id   : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		time        : {
			date      : Date,
			start     : {
				_hour   : Number,
				_minute : Number
			},
			end       : {
				_hour   : Number,
				_minute : Number
			},
			check_in  : {
				type    : Date,
				default : Date.now
			},
			check_out : {
				type    : Date,
				default : Date.now
			}
		},
		services    : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Service' } ],
		status      : {
			type    : String,
			enum    : [ 'ready', 'inProgress', 'done', 'pendingClient', 'pendingBusiness', 'passed', 'canceled' ],
			default : 'ready'
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
