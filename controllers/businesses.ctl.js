const JWT = require('jsonwebtoken');
const Businesses = require('../models/business');
const Categories = require('../models/category');

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');

module.exports = {
	createBusiness: async (req, res, next) => {
		console.log('create Business called!!');
		// get all params
		const { name, category_id } = req.body;
		// checking if user already have a business
		const business = await Businesses.findOne({ owner_id: req.user._id });
		if (business) {
			return res.status(403).json({ error: 'you already have a business page' });
		}

		// if  category is not a real category
		const isCat = await Categories.findById(category_id, 'name');
		if (!isCat) return res.status(404).json({ error: 'inValid Category' });

		var newBusiness = new Businesses({
			owner_id: req.user._id,
			profile: {
				name: name,
				category_id: category_id
			}
		});
		await newBusiness.save();
		res.status(200).json({ success: 'bussiness successfully created' });
	}
};
