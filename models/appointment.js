const Review = require('../models/review');
const mongoosePaginate = require('mongoose-paginate-v2');

var mongoose = require('mongoose'),
	appointment = new mongoose.Schema(
		{
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
		},
		{ toJSON: { virtuals: true } },
		{ toObject: { virtuals: true } }
	);

appointment.virtual('review', {
	ref          : 'Review',
	localField   : '_id',
	foreignField : 'appointment_id',
	justOne      : true
	// options      : { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});
appointment.plugin(mongoosePaginate);
var Appointment = mongoose.model('Appointment', appointment);

module.exports = Appointment;
