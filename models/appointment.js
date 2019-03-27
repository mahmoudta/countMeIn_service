var mongoose = require('mongoose'),
	appointment = new mongoose.Schema({
		ID: String,
		business_id: String,
		client_id: String,
		time: {
			day: String,
			date: Date,
			start: Date /* Date Type Contains date and time */
		},
		porpouses: [ String ]
	});

var Appointment = mongoose.model('Appointment', appointment);

module.exports = Appointment;
