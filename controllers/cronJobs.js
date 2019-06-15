const Appointments = require('../models/appointment');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const Users = require('../models/user');

const mongoose = require('mongoose');
const moment = require('moment');
mongoose.Promise = global.Promise;
setInterval(async function() {
	var yestrday = moment().subtract(1, 'days').startOf('day').toDate();
	let today = moment(moment().format('L')).toDate();

	let time = new Date();
	/* change apppointment status to passed */

	const appointments = await Appointments.updateMany(
		{ 'time.date': new Date(today), 'time.end._hour': { $lt: Number(time.getHours()) }, status: 'ready' },
		{ $set: { status: 'passed' } },
		{
			multi       : true,
			client_id   : 1,
			business_id : 1,
			_id         : 1,
			new         : true
		}
	);

	console.log(appointments);

	const users = Businesses.updateMany({ _id: { $in: appointments } });
}, 1 * 60 * 60 * 1000); // 1 hour
