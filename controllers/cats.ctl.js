const JWT = require('jsonwebtoken');
const Categories = require('../models/category');
const Services = require('../models/service');

const Businesses = require('../models/business');
const mongoose = require('mongoose');

const { JWT_SECRET } = require('../consts');

module.exports = {
	getAllCategories : async (req, res, next) => {
		const categories = await Categories.find({}).populate('services', '-parent_category');
		if (!categories) {
			return res.status(404).json({ message: 'No category has been founded' });
		}
		res.status(200).json({ categories });
	},

	createCategory   : async (req, res, next) => {
		const { name } = req.body;
		const cat = await Categories.findOne({ name });
		if (cat) {
			return res.status(403).json({ error: 'This category already exsits' });
		}
		const category = new Categories({
			_id  : new mongoose.Types.ObjectId(),
			name
		});
		await category.save();
		res.status(200).json({ success: 'sucsessfully added' });
	},

	addService       : async (req, res, next) => {
		const { parent_category, name, time, cost } = req.body;
		const service = new Services({
			_id             : new mongoose.Types.ObjectId(),
			parent_category : mongoose.Types.ObjectId(parent_category),
			title           : name,
			time            : Number(time),
			cost            : Number(cost)
		});

		const saved = await service.save();

		if (!saved) return res.status(404).json({ error: 'Error Ocured' });

		const newCategory = await Categories.findOneAndUpdate(
			{ _id: parent_category },
			{
				$push : { services: saved._id }
			},
			{ $new: true, useFindAndModify: false }
		).populate('services', '-parent_category');
		/* TODO -CHECK HOW To return it back */
		res.status(200).json({ category: newCategory });
	},

	deleteCategory   : async (req, res, next) => {
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

		if (!category) return res.json({ error: 'An Error Occurred while deleting' });
		// console.log(category)
		res.status(200).json({ category });
	},

	deleteService    : async (req, res, next) => {
		// check if service related to business ,
		// if yes => we cant DELETE IT
		const { id } = req.params;
		const business = await Businesses.findOne({});

		if (business)
			return res.status(404).json({ error: 'you can not delete this Service, some businesses already using it' });

		//Else ( Not Related) => DELETE
		const service = await Categories.updateOne({}, { $pull: { subCats: { _id: id } } });
		if (!service) return res.status(404).json({ error: 'An Error Occurred' });

		res.status(200).json({ success: ` service has been deleted` });
	}
};
