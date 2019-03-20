const JWT = require('jsonwebtoken');
const Categories = require('../models/category');
const { JWT_SECRET } = require('../consts');

module.exports = {
	createCategory: async (req, res, next) => {
		console.log('create Called');
		console.log(req.body);
		const { name } = req.body;
		const cat = await Categories.findOne({ name });
		if (cat) {
			return res.status(403).json({ message: 'This category already exsits' });
		}
		const category = new Categories({ name });
		await category.save();
		res.status(200).json({ message: 'sucsessfully added' });
	},

	getAllCategories: async (req, res, next) => {
		const categories = await Categories.find({});
		if (!categories) {
			return res.status(404).json({ message: 'No category has been founded' });
		}
		res.status(200).json({ categories });
	}
};
