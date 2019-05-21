var mongoose = require('mongoose'),
	business = new mongoose.Schema({
		Schedule_id: String /*the Schedule id for this bussniess*/,
		owner_id: {
			type: String /* id of client that owns this bussniess*/,
			required: true
		},
		profile: {
			name: {
				type: String,
				required: true
			},
			description: String,
			category_id: {
				type: Array,
				required: true
				//Array
			},
			img: String,
			services: [
				{
					//services
					service_id: String,
					time: {
						type: Number,
						max: 120
					},
					cost: Number
				}
			],
			rating: Number,
			working_hours: [
				{
					/* array which length = 7 (week)*/
					day: {
						type: String
						// enum: [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ]
					},
					opened: Boolean,
					from: {
						type: Date
					},
					until: {
						type: Date
					}
				}
			],
			location: {
				street: String,
				city: String,
				building: Number,
				postal_code: Number
			},
			break_time: {
				type: Number,
				default: 10
			}
		} /*end of profile*/,
		style_id: String /* id for style document*/,
		//
		customers: [
			{
				customer_id: String,
				isFollower: Boolean,
				experiance: {
					type: Number,
					default: 0
				}
			}
		] /* array of Clients_ids */
	});

business.methods.createTime = async function(time) {
	try {
		let splitter = time.split(':');
		let date = new Date();
		date.setHours(Number(splitter[0]), Number(splitter[1]));
		console.log(`date: ${date}`);
		return await date;
	} catch (error) {
		throw new Error(error);
	}
};

var Business = mongoose.model('Business', business);

module.exports = Business;
