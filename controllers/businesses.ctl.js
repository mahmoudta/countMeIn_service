const JWT = require('jsonwebtoken');
const Businesses = require('../models/business');
const Categories = require('../models/category');

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');
createTime = async (time) => {
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
		const { name, category, img, working, break_time, services } = req.body;
		// checking if user already have a business
		const business = await Businesses.findOne({ owner_id: req.user._id });
		if (business) {
			return res.status(403).json({ error: 'you already have a business page' });
		}

		// if  category is not a real category
		const isCat = await Categories.findById(category, 'name');
		// if not => return error
		if (!isCat) return res.status(404).json({ error: 'inValid Category' });

		/* convert request working hours to real date object  */
		var items = [];
		const fillTime = async () => {
			for (const element of working) {
				const from = await createTime(element.from);
				const until = await createTime(element.until);
				await items.push({
					day: element.day,
					opened: element.opened,
					from: from,
					until: until
				});
			}
			return await items;
		};

		/* splitting the */

		const newBusiness = new Businesses({
			owner_id: req.user._id,
			profile: {
				name: name,
				category_id: category,
				purposes: services,
				working_hours: await fillTime(),
				break_time: break_time
			}
		});
		await newBusiness.save();
		res.status(200).json({ success: 'bussiness successfully created' });
	},

	getAllBusinesses: async (req, res, next) => {
		const businesses = await Businesses.find({});
		if (!businesses) return res.status(404).json({ error: 'not found' });
		res.status(200).json({ businesses });
	},

	getBusinessForView: async (req, res, next) => {
		const id = req.params.id;
		const business = await Businesses.findById(id);
		if (!business) return res.status(404).json({ error: 'Business invalid' });
		res.status(200).json({ business });
	},

	getBusinessByOwner: async (req, res, next) => {
		const owner_id = req.params.owner_id;
		const business = await Businesses.findOne({ owner_id: owner_id });
		if (!business) return res.status(404).json({ error: 'Business invalid' });

		res.status(200).json({ business });
	},

	editBusiness: async (req, res, next) => {
		console.log('edit Business Called!');
		//get id

		// get all request params

		//
	},
	followBusiness: async (req, res, next) => {
		console.log('follow business');
		const { business_id } = req.body;
		console.log(`business_id:${business_id}`);
		console.log(req.user._id);

		// check if business
		const business = await Businesses.findById(business_id);
		if (!business) return res.status(404).json({ error: 'invalid business' });

		// check if user already following this business
		const exist = business.followers.find(async (user) => {
			return (await user.client_id) === req.user._id;
		});
		if (exist) return res.status(403).json({ error: 'already follower' });

		//push the customer id to followers
		const update = {
			$push: {
				followers: {
					client_id: req.user._id
				}
			}
		};

		const updated_business = await Businesses.findByIdAndUpdate(business_id, update);

		if (!updated_business) return res.status(404).json({ error: 'an error occurred' });

		res.status(404).json({ success: updated_business });
	}
};
