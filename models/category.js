const Services = require('./service');
const mongoose = require('mongoose'),
	category = new mongoose.Schema({
		_id      : { type: mongoose.Schema.Types.ObjectId },

		name     : {
			type      : String,
			lowercase : true,
			required  : true,
			unique    : true,
			trim      : true
		},
		services : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Service' } ]
	});

category.post('findOneAndDelete', async function(category) {
	/* delete all the services related to deleted category */

	await Services.deleteMany({ parent_category: category._id });
});

var Category = mongoose.model('Category', category);

module.exports = Category;
