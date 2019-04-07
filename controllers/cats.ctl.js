const JWT = require('jsonwebtoken');
const Categories = require('../models/category');
const Businesses = require('../models/business');

const { JWT_SECRET } = require('../consts');

module.exports = {
	getAllCategories: async (req, res, next) => {
		const categories = await Categories.find({});
		if (!categories) {
			return res.status(404).json({ message: 'No category has been founded' });
		}
		res.status(200).json({ categories });
	},

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
		// check if category related to business ,
		// if yes => we cant DELETE IT
		const { id } = req.params;
		const business = await Businesses.findOne({ 'profile.category_id': id });

		if (business)
			return res
				.status(404)
				.json({ error: 'you can not delete this category, some businesses already using it' });

		//Else ( Not Related) => DELETE
		const category = await Categories.findOneAndDelete({ _id: id });

		if (!category) return res.status(404).json({ error: 'An Error Occurred' });

		res.status(200).json({ success: ` ${category.name} has been deleted` });
	},

	deleteService: async (req, res, next) => {
		// check if service related to business ,
		// if yes => we cant DELETE IT
		const { id } = req.params;
		const business = await Businesses.findOne({ 'profile.purposes': { $elemMatch: { purpose_id: id } } });

		if (business)
			return res.status(404).json({ error: 'you can not delete this Service, some businesses already using it' });

		//Else ( Not Related) => DELETE
		const service = await Categories.findOneAndUpdate({}, { $pull: { subCats: { _id: id } } });
		if (!service) return res.status(404).json({ error: 'An Error Occurred' });

		res.status(200).json({ success: ` service has been deleted` });
	}
};
