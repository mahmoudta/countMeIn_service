const { time_range } = require('../controllers/algs/free-alg');
const mongoose = require('mongoose'),
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
				freeTime: [ time_range ]
			}
		]
	});
	freeTime.methods.createDate = async function(business_id,date) {
		try {
			console.log(date);
			return await date;
		} catch (error) {
			throw new Error(error);
		}
	};

var freeTime = mongoose.model('freeTime', freeTime);
module.exports = freeTime;
