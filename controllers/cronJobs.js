const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
var FreeTime = require('../models/freeTime');
// const Categories = require('../models/category');
// const Users = require('../models/user');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const moment = require('moment');
const {
	getbusinessAvgRatingByDateRange,

	servicesDayStatistics,
	createInsights,
	createAppointmentsInsights,
	createTotalFollowersCount
} = require('./functions/business.funcs');

// mongoose.Promise = global.Promise;
setInterval(async function() {
	//var yestrday = moment().subtract(1, 'days').startOf('day').toDate();
	let today = moment(new Date(), 'l');
	// let today = moment(new Date()).format('l');

	let time = new Date();
	/* change apppointment status to passed */

	const appointments = await Appointments.updateMany(
		{ 'time.date': { $lt: new Date(today) }, 'time.end._hour': { $lt: Number(time.getHours()) }, status: 'ready' },
		{ $set: { status: 'passed' } },
		{
			multi : true
		}
	);
}, 1 * 60 * 60 * 1000); // 1 hour

var rule = new schedule.RecurrenceRule();

/* sechdule job runs recursevly every day at 00:01 (which means after day end) */
rule.hour = 0;
rule.minute = 1;
var scheduleJob = schedule.scheduleJob(rule, async function() {
	var momentdate = moment().format('l');
	var date = new Date(momentdate);
	const vvv = await FreeTime.updateMany({}, { $pull: { dates: { day: { $lt: date } } } });

	/* Statistics Update  */
	/* Today will get the rate of yesterday as a start point */

	await servicesDayStatistics();
	await createInsights();
	await createAppointmentsInsights();
	await createTotalFollowersCount();
});
