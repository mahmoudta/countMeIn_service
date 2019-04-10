var mongoose = require('mongoose'),
	appointment = new mongoose.Schema({
		ID: String,
		business_id: String,
		client_id: String,
		time: {
			day: String,
			date: Date,
			hours: Number /* Date Type Contains date and time */,
			minutes: Number
		},
		porpouses: [ String ]
	});

var Appointment = mongoose.model('Appointment', appointment);

module.exports = Appointment;
