const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
var FreeTime = require('../models/freeTime');
const Categories = require('../models/category');
const Users = require('../models/user');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const moment = require('moment');
mongoose.Promise = global.Promise;
setInterval(async function() {
	//var yestrday = moment().subtract(1, 'days').startOf('day').toDate();
	let today = moment(new Date()).format('l');

	let time = new Date();
	/* change apppointment status to passed */

	const appointments = await Appointments.updateMany(
		{ 'time.date': new Date(today), 'time.end._hour': { $lt: Number(time.getHours()) }, status: 'ready' },
		{ $set: { status: 'passed' } }
		// {
		// 	multi       : true,
		// 	client_id   : 1,
		// 	business_id : 1,
		// 	_id         : 1,
		// 	new         : true
		// }
	);

	// const users = Businesses.updateMany({ _id: { $in: appointments } });
}, 1 * 60 * 60 * 1000); // 1 hour

var j = schedule.scheduleJob('1 0 * * *', async function() {
	var momentdate = moment().format('l');
	var date = new Date(momentdate);
	// console.log(date);
	// const vvv = await FreeTime.updateMany(
	// 	{
	// 		// $match : { 'dates.day': { $lt: date } }
	// 	},
	// 	{ $pull: { dates: { day: { $lt: date } } } }
	// );

	/* Statistics Update  */
	/* Today will get the rate of yesterday as a start point */
});
