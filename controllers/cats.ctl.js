const JWT = require('jsonwebtoken');
const Categories = require('../models/category');
const { JWT_SECRET } = require('../consts');

module.exports = {
	createCategory: async (req, res, next) => {
		const { name } = req.body;
		const cat = await Categories.findOne({ name });
		if (cat) {
			console.log('error');

			return res.status(403).json({ error: 'This category already exsits' });
		}
		const category = new Categories({ name });
		await category.save();
		res.status(200).json({ success: 'sucsessfully added' });
	},

	getAllCategories: async (req, res, next) => {
		const categories = await Categories.find({});
		if (!categories) {
			return res.status(404).json({ message: 'No category has been founded' });
		}
		res.status(200).json({ categories });
	},

	addSubCategory: async (req, res, next) => {
		const { parent_category, name, time } = req.body;
		Categories.findOneAndUpdate(
			{ _id: parent_category },
			{
				$push: {
					subCats: { sub: name, time: Number(time) }
				}
			},
			(err, doc) => {
				if (err) {
					res.status(404).json({ error: 'No Category match' });
					return;
				} else if (doc.nModified == 0) {
					res.status(403).json({ error: 'Permission Denied' });
					return;
				}
				res.status(200).json({ success: 'Sub-category has been added' });
			}
		);
	},

	deleteCategory: async (req, res, next) => {
		//TODO
	}
};
