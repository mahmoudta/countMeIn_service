const Insight = require('./insight');
var mongoose = require('mongoose'),
	business = new mongoose.Schema(
		{
			_id               : { type: mongoose.Schema.Types.ObjectId },
			Schedule_id       : String /*the Schedule id for this bussniess*/,
			owner_id          : {
				// type: String /* id of client that owns this bussniess*/,
				required : true,
				type     : mongoose.Schema.Types.ObjectId,
				ref      : 'User'
			},
			categories        : [
				{
					type     : mongoose.Schema.Types.ObjectId,
					required : true,
					ref      : 'Category'
				},
				{ _id: 0 }
				//Array
			],
			services          : [
				{
					//services
					service_id : {
						type : mongoose.Schema.Types.ObjectId,
						ref  : 'Service'
					},
					time       : {
						type : Number,
						max  : 120
					},
					cost       : Number
				},
				{ _id: false }
			],
			break_time        : {
				type    : Number,
				default : 10
			},
			working_hours     : [
				{
					/* array which length = 7 (week)*/
					day    : {
						type : String
						// enum: [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ]
					},
					opened : Boolean,
					from   : {
						type : Date
					},
					until  : {
						type : Date
					},
					break  : {
						isBreak : Boolean,
						from    : Date,
						until   : Date
					}
				},
				{ _id: false }
			],
			schedule_settings : {
				/* */
				customers_exp             : {
					type    : Boolean,
					default : true
				},
				continuity                : {
					type    : Number,
					default : 3,
					max     : 10,
					min     : 0
				},
				distrbuted_time           : {
					type    : Number,
					default : 3,
					max     : 20,
					min     : 1
				},
				days_calculate_length     : {
					type    : Number,
					default : 7,
					min     : 2,
					max     : 30
				},
				max_working_days_response : {
					type    : Number,
					default : 7,
					min     : 1,
					max     : 30
				},
				experiance_rule           : {
					type    : Number,
					default : 1,
					min     : 1,
					max     : 5
				},
				customer_prefered_period  : {
					type    : Number,
					default : 6,
					min     : 1,
					max     : 9
				}
			},
			profile           : {
				name        : {
					type     : String,
					required : true
				},
				phone       : {
					type     : String,
					required : true,
					index    : { unique: true }
				},
				description : String,

				img         : String,

				rating      : {
					rating_sum         : {
						type     : Number,
						required : true,
						default  : 0
					},
					rating_count       : {
						type     : Number,
						required : true,
						default  : 0
					},
					recommendation_sum : {
						type     : Number,
						required : true,
						default  : 0
					}
				},

				location    : {
					street      : String,
					city        : String,
					building    : Number,
					postal_code : Number
				}
			} /*end of profile*/,
			style_id          : String /* id for style document*/,
			//
			customers         : [
				{
					customer_id : {
						type : mongoose.Schema.Types.ObjectId,
						ref  : 'User'
					},
					isFollower  : Boolean,
					experiance  : {
						type    : Number,
						default : 0
					}
				}
			] /* array of Clients_ids */
		},
		{ toJSON: { virtuals: true } },
		{ toObject: { virtuals: true } }
	);
business.virtual('insights', {
	ref          : 'Insight',
	localField   : '_id',
	foreignField : 'business_id',
	justOne      : false
	// options      : { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

business.post('find', async function(doc, next) {
	//console.log(this);
	// if (this.method != 'local') {
	// 	next();
	// }
	// try {
	// 	const salt = await bcrypt.genSalt(10);
	// 	const passwordHash = await bcrypt.hash(this.local.password, salt);
	// 	this.local.password = passwordHash;
	// 	next();
	// } catch (error) {
	// 	next(error);
	// }
});

var Business = mongoose.model('Business', business);

module.exports = Business;
