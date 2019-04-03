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
			category_id: {
				type: String,
				required: true
			},
			img: String,
			purposes: [
				{
					purpose_id: String,
					time: {
						type: Number,
						max: 120
					}
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
			break_time: Number
		} /*end of profile*/,
		style_id: String /* id for style document*/,
		followers: [
			{
				client_id: String,
				experiance: Number
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
