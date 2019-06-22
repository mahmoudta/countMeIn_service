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

// export default (isValidCategory = async function(category_id) {
// 	try {
// 		const category = await category.findById(category_id);
// 		if (category) return true;
// 		return false;
// 	} catch (error) {
// 		throw new Error(error);
// 	}
// });

category.post('findOneAndDelete', async function(category) {
	/* delete all the services related to deleted category */

	await Services.deleteMany({ parent_category: category._id });
});

var Category = mongoose.model('Category', category);

module.exports = Category;
