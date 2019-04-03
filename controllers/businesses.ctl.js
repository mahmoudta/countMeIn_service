const JWT = require('jsonwebtoken');
const Businesses = require('../models/business');
const Categories = require('../models/category');

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');
createTime = async function(time) {
	try {
		let splitter = time.split(':');
		let date = new Date();
		date.setHours(Number(splitter[0]), Number(splitter[1]));
		// console.log(`date: ${date}`);
		return await date;
	} catch (error) {
		throw new Error(error);
	}
};
module.exports = {
	createBusiness: async (req, res, next) => {
		console.log('create Business called!!');
		// get all params
		const { name, category, img, working, break_time, purposes } = req.body;
		// checking if user already have a business
		const business = await Businesses.findOne({ owner_id: req.user._id });
		if (business) {
			return res.status(403).json({ error: 'you already have a business page' });
		}

		// if  category is not a real category
		const isCat = await Categories.findById(category, 'name');
		if (!isCat) return res.status(404).json({ error: 'inValid Category' });
		var items = [];
		const fillTime = async () => {
			for (const element of working) {
				const from = await createTime(element.from);
				const until = await createTime(element.until);
				console.log(from.getHours(), until.getHours());
				await items.push({
					day: element.day,
					opened: element.opened,
					from: from,
					until: until
				});
			}
			return await items;
		};

		console.log(await fillTime());
		const newBusiness = new Businesses({
			owner_id: req.user._id,
			profile: {
				name: name,
				category_id: category,
				purposes: purposes,
				working_hours: await fillTime(),
				break_time: break_time
			}
		});
		await newBusiness.save();
		res.status(200).json({ success: 'bussiness successfully created' });
	},

	getBusinessForView: async (req, res, next) => {
		const id = req.params.id;
		const business = await Businesses.findById(id);
		if (!business) return res.status(404).json({ error: 'Business invalid' });
		res.status(200).json({ business });
	},

	getBusinessByOwner: async (req, res, next) => {
		const owner_id = req.params.client_id;
		const business = await Businesses.findOne({ owner_id: owner_id });
		if (!business) return res.status(404).json({ error: 'Business invalid' });

		res.status(200).json({ business });
	},

	editBusiness: async (req, res, next) => {
		console.log('edit Business Called!');
		//get id

		// get all request params

		//
	}
};
