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
			rating: Number,
			working_hours: [
				{
					/* array which length = 7 (week)*/
					day: {
						enum: [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ]
					},
					from: {
						type: Date,
						timezone: 'Asia/Israel'
					},
					until: {
						type: Date,
						timezone: 'Asia/Israel'
					}
				}
			],
			location: {
				street: String,
				city: String,
				building: Number,
				postal_code: Number
			}
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
		console.log(date);
		return await date;
	} catch (error) {
		throw new Error(error);
	}
};

var Business = mongoose.model('Business', business);

module.exports = Business;
