const mongoose = require('mongoose'),
	category = new mongoose.Schema({
		_id: { type: mongoose.Schema.Types.ObjectId },

		name: {
			type: String,
			lowercase: true,
			required: true,
			unique: true,
			trim: true
		},
		services: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Service' } ]
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

var Category = mongoose.model('Category', category);

module.exports = Category;
