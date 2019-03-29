const mongoose = require('mongoose'),
	category = new mongoose.Schema({
		name: {
			type: String,
			lowercase: true,
			required: true,
			unique: true,
			trim: true
		},
		subCats: [
			{
				sub: {
					type: String,
					lowercase: true,
					trim: true,
					required: true
				},
				time: {
					/* 
                    *   time specified with minutes  
                    *   minimum time for purpose is 10 min maximum 2 hours
                    */
					type: Number,
					min: 10,
					max: 120,
					required: true
				}
			}
		]
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
