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
		],
		totalworkingminuts: {
			type: Number,
			default: 0
		}
	});


var FreeTime = mongoose.model('FreeTime',freeTime, 'freetime');
module.exports = FreeTime;
