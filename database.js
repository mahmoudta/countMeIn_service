var consts = require('./consts'),
	mongoose = require('mongoose');

//define the MODEL
var Businesses = require('./models/business'),
	Users = require('./models/user'),
	FreeTime = require('./models/freeTime');
	Appointments = require('./models/appointment');
options = {
	autoReconnect: true,
	useNewUrlParser: true,
	useCreateIndex: true
};
mongoose.Promise = global.Promise;
mongoose.connect(consts.MLAB, options).then(
	() => {
		console.log('connected');
	},
	(err) => {
		console.log(`connection error: ${err}`);
	}
);
