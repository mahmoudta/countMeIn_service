const moment = require('moment')
var mongoose = require('mongoose'),
	freeTime = new mongoose.Schema({
		business_id: {
			type: String,
			required: true,
			unique: true
		},
		dates: [
			{
				day: {
					type: Date
				},
				freeTime: Array
			}
		]
	});


var FreeTime = mongoose.model('FreeTime',freeTime, 'freetime');
module.exports = FreeTime;
