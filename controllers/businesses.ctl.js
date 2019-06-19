const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../consts');

const Businesses = require('../models/business');
const Categories = require('../models/category');
const Appointments = require('../models/appointment');
const Reviews = require('../models/review');
const Services = require('../models/service');
const Users = require('../models/user');
const { getFollowers, isUserFollower, getCustomer } = require('../utils/business.utils');
const { getFullserviceData } = require('../utils/categories.utils');
const { aftereditingbusnessworkinghours } = require('./algs/free-alg');
const isEmpty = require('lodash/isEmpty');
const {
	getbusinessAvgRatingByDateRange,
	rateIncrement,
	profileViewIncerement,
	unFollowClickIncerement,
	followClickIncrement
} = require('./functions/business.funcs');

const mongoose = require('mongoose');

signInToken = (user, business_id = '') => {
	return JWT.sign(
		{
			sub: user._id,
			isAdmin: user.isAdmin,
			profile: user.profile,
			isBusinessOwner: !isEmpty(business_id) ? true : false,
			business_id: business_id
		},
		JWT_SECRET
	);
};
// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');
createTime = async (time) => {
	try {
		let splitter = time.split(':');
		let date = new Date();
		date.setHours(Number(splitter[0]), Number(splitter[1]), 0);
		return await date;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {


	getBusinessesByCatagoryArray: async (req, res, next) => {
		const { catagoryIdArray } = req.body;
		const ResultQuery = ['empty'];
		catagoryIdArray.forEach(async (value, i) => {
			ResultQuery = await Businesses.find(
				{
					'profile.category_id': value
				},
				'_id'
			);
		});
		res.status(200).json({ ResultQuery });
	},

	getAllCustomers: async (req, res, next) => {
		const business = await Businesses.findOne({ owner_id: req.user._id }, 'customers.customer_id');
		if (!business) return res.status(404).json({ error: 'business not found' });
		const ids = await business.customers.map((customer) => {
			return customer.customer_id;
		});

		const customers = await Users.find({ _id: { $in: ids } }, 'profile.name');

		if (!customers) return res.status(404).json({ error: 'an error occurred' });

		res.status(200).json({ customers });
	},
	getServicesByBusiness: async (req, res, next) => {
		const { id } = req.params;
		const business = await Businesses.findById(id).populate('services.service_id');
		if (!business) return res.status(404).json({ error: 'business not found' });
		const services = await business.services.map((service) => {
			return { title: service.service_id.title, _id: service.service_id._id, cost: service.service_id.cost, time: service.service_id.time };
		});
		console.log(services)
		if (!services) return res.status(404).json({ error: 'an error occurred' });
		res.status(200).json({ services });
	},
	// getBusinessesByCatagory       : async (req, res, next) => {
	// 	const { catagoryId } = req.params;
	// 	//var catagoryId = JSON.parse(req.params);

	// 	const ResultQuery = await Businesses.find(
	// 		{
	// 			'profile.category_id' : catagoryId
	// 		},
	// 		'_id'
	// 	);

	// 	res.status(200).json({ ResultQuery });
	// },

	getBusinessesByCatagory: async (req, res, next) => {
		const { catagoryId } = req.params;
		//var catagoryId = JSON.parse(req.params);

		const business = await Businesses.find(
			{
				categories: mongoose.Types.ObjectId(catagoryId)
			},
			'profile'
		);

		res.status(200).json({ business });
	},

	getAllBusinesses: async (req, res, next) => {
		const businesses = await Businesses.find({});
		if (!businesses) return res.status(404).json({ error: 'not found' });
		res.status(200).json({ businesses });
	},

	/* Adhamm */
	getBusinessForView: async (req, res, next) => {
		console.log('business for view');
		const id = mongoose.Types.ObjectId(req.params.id);
		const user_id = req.user.id;
		const business = await Businesses.findById(id)
			.populate('services.service_id', 'title')
			.populate('categories', 'name')
			.lean();

		if (!business) res.status(404).json({ error: 'business not found' });

		/* Object of this user inside the Business */
		const follower = await business.customers.find((customer) => {
			return customer.customer_id._id.toString() === req.user._id.toString();
		});

		const followers = await business.customers.filter((customer) => {
			return customer.isFollower === true;
		});

		/* this function called to count the number of views on the page per day */
		if (business.owner_id.toString() !== user_id.toString()) {
			profileViewIncerement(business._id);
		}
		business['isFollower'] = isEmpty(follower) ? false : follower.isFollower;
		business['followers'] = followers.length;

		res.status(200).json({ business });
	},

	getBusinessByOwner: async (req, res, next) => {
		const owner_id = req.params.owner_id;
		const business = await Businesses.findOne({ owner_id: owner_id })
			.populate('categories')
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile')
			.lean();
		if (!business) return res.status(400).json({ error: 'Business Not Found' });
		// const categories = await Categories.find({ _id: { $in: 'business.categories' } }).populate('services', 'title');
		// business.categories = categories;

		res.status(200).json({ business });
	},

	createBusiness: async (req, res, next) => {
		console.log('create Business called!!');
		// get all params
		const {
			street,
			city,
			building,
			postal_code,
			breakTime,
			categories,
			description,
			name,
			img,
			phone,
			working,
			services
		} = req.body;
		// checking if user already have a business
		const Qbusiness = await Businesses.findOne({ owner_id: req.user._id });
		if (Qbusiness) {
			return res.status(403).json({ error: 'you already have a business' });
		}

		//TODO
		// if  category is not a real category
		// const isCat = await Categories.find(category, 'name');
		// if not => return error
		// if (!isCat) return res.status(404).json({ error: 'inValid Category' });

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
					until: until,
					break: {
						isBreak: element.break.isBreak ? true : false,
						from: await createTime(element.break.from),
						until: await createTime(element.break.until)
					}
				});
			}
			return await items;
		};

		/* splitting the categories and the services */
		const NewCategories = await categories.map((category) => {
			return mongoose.Types.ObjectId(category.value);
		});
		const NewServices = await services.map((service) => {
			return {
				service_id: mongoose.Types.ObjectId(service.value),
				time: Number(service.time),
				cost: Number(service.cost)
			};
		});
		const newBusiness = new Businesses({
			_id: new mongoose.Types.ObjectId(),
			owner_id: mongoose.Types.ObjectId(req.user._id),
			profile: {
				name: name,
				img: !isEmpty(img) ? img : '',
				location: {
					street: !isEmpty(street) ? street : '',
					city: !isEmpty(city) ? city : '',
					building: !isEmpty(building) ? Number(building) : 0,
					postal_code: !isEmpty(postal_code) ? Number(postal_code) : 0
				},
				phone: phone,
				description: !isEmpty(description) ? description : ''
			},
			services: NewServices,
			categories: NewCategories,
			working_hours: await fillTime(),
			break_time: !isEmpty(breakTime) ? breakTime : 10
		});
		const business = await newBusiness.save();
		if (!business) return res.status(403).json({ error: 'some error accourd during create' });
		const businessNew = await Businesses.findById(business._id)
			.populate('services.service_id', 'title')
			.populate('categories');

		const token = signInToken(req.user, business._id);
		// business.profile.services = [];
		res.status(200).json({ business: businessNew, token });
	},

	editBusiness: async (req, res, next) => {
		console.log('edit Business Called!');
		const {
			business_id,
			street,
			city,
			building,
			postal_code,
			breakTime,
			categories,
			description,
			name,
			img,
			phone,
			working,
			services,
			working_edits
		} = req.body;
		// checking if user already have a business
		// const Qbusiness = await Businesses.findOne({ owner_id: req.user._id });
		// if (Qbusiness) {
		// 	return res.status(403).json({ error: 'you already have a business' });
		// }

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
					until: until,
					break: {
						isBreak: element.break.isBreak ? true : false,
						from: await createTime(element.break.from),
						until: await createTime(element.break.until)
					}
				});
			}
			return await items;
		};

		/* splitting the categories and the services */

		const NewCategories = await categories.map((category) => {
			return mongoose.Types.ObjectId(category.value);
		});

		const NewServices = await services.map((service) => {
			return {
				service_id: mongoose.Types.ObjectId(service.value),
				time: Number(service.time),
				cost: Number(service.cost)
			};
		});
		const updateBusiness = {
			profile: {
				name: name,
				img: !isEmpty(img) ? img : '',
				location: {
					street: !isEmpty(street) ? street : '',
					city: !isEmpty(city) ? city : '',
					building: !isEmpty(building) ? Number(building) : 0,
					postal_code: !isEmpty(postal_code) ? Number(postal_code) : 0
				},
				phone: phone,
				description: !isEmpty(description) ? description : ''
			},
			services: NewServices,
			categories: NewCategories,
			working_hours: await fillTime(),
			break_time: !isEmpty(breakTime) ? breakTime : 10
		};

		let business = await Businesses.findOneAndUpdate({ _id: business_id }, updateBusiness, { new: true })
			.populate('categories')
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile');
		if (!business) return res.status(403).json({ error: 'some error accourd during update' });

		/* send the working edits array to free time tree to make a changes on the tree. */
		//console.log(working_edits);
		aftereditingbusnessworkinghours(business._id, working_edits);
		res.status(200).json({ business });
	},

	followBusiness: async (req, res, next) => {
		console.log('follow business');
		const { business_id } = req.body;
		let business_query = {}; /* object to hold the query for business */
		let business_update = {}; /* object to hold the updated fileds of business */

		// check if business
		const business = await Businesses.findById(business_id)
			.populate('services.service_id', 'title')
			.populate('categories', 'name');

		if (!business) return res.status(404).json({ error: 'Business Not Found' });

		/* Object of this user inside the Business */
		const customer = await business.customers.find((customer) => {
			return customer.customer_id._id.toString() === req.user._id.toString();
		});

		/* if customer  is empty object then we have to push this user to customers and make it follower*/

		if (!isEmpty(customer)) {
			if (customer.isFollower) return res.status(200).json({ business }); /* user already followe */
			business_query = { _id: business_id, 'customers.customer_id': req.user._id };

			business_update = {
				$set: {
					'customers.$.isFollower': true
				},
				$inc: { 'customers.$.experiance': 2 }
			};
		} else {
			/* else : the user is exists in the follower list we should only update the flag to follower.*/
			business_query = { _id: business_id };
			business_update = {
				$push: {
					customers: {
						customer_id: mongoose.Types.ObjectId(req.user._id),
						isFollower: true,
						experiance: 3
					}
				}
			};
		}

		/* make the update to the business */
		const new_business = await Businesses.findOneAndUpdate(business_query, business_update);

		if (!new_business) return res.status(304).json({ error: 'error occourd while updating' });

		/* if the update successfully done */
		const userUpdate = {
			$push: {
				following: mongoose.Types.ObjectId(business_id)
			}
		};
		/* push business id to business */
		const updated_user = await Users.findOneAndUpdate({ _id: req.user._id }, userUpdate);
		followClickIncrement(business_id);
		// if (!updated_business) return res.status(404).json({ error: 'an error occurred' });

		res.status(200).json({ isFollower: true });
	},

	unfollowBusiness: async (req, res, next) => {
		const { business_id } = req.body;
		// check if business
		const business = await Businesses.findById(business_id)
			.populate('services.service_id', 'title')
			.populate('categories', 'name');

		if (!business) return res.status(404).json({ error: 'business Not Found' });

		//unfollow
		const update = {
			$set: {
				'customers.$.isFollower': false
			},
			$inc: { 'customers.$.experiance': -3 }
		};

		const userUpdate = {
			$pull: {
				following: mongoose.Types.ObjectId(business_id)
			}
		};
		/* push user id to business */
		const updated_business = await Businesses.findOneAndUpdate(
			{ _id: business_id, 'customers.customer_id': req.user._id },
			update
		);

		if (!updated_business) return res.status(403).json({ error: 'an error occurred' });

		/* push business id to business */
		const updated_user = await Users.findOneAndUpdate({ _id: req.user._id }, userUpdate);
		unFollowClickIncerement(business_id);
		res.status(200).json({ isFollower: false });
	},

	// getServicesByBusiness: async (req, res, next) => {
	// 	const { id } = req.params;
	// 	const business = await Businesses.findById(id);
	// 	if (!business) return res.status(404).json({ error: 'business not found' });
	// 	const ids = await business.profile.services.map((service) => {
	// 		return service.service_id;
	// 	});
	// 	const category = await Categories.findById(business.profile.category_id);

	// 	const services = await category.subCats.filter((elem) => {
	// 		return ids.includes(elem._id.toString());
	// 	});

	// 	if (!services) return res.status(404).json({ error: 'an error occurred' });
	// 	res.status(200).json({ services });
	// },
	UpdateSmartAlgorithmsSettings: async (req, res, next) => {
		const {
			customers_exp,
			continuity,
			distrbuted_time,
			days_calculate_length,
			max_working_days_response,
			customer_prefered_period,
			experiance_rule
		} = req.body;
		update = {
			$set: {
				schedule_settings: {
					customers_exp: customers_exp,
					continuity: continuity,
					distrbuted_time: distrbuted_time,
					days_calculate_length: days_calculate_length,
					max_working_days_response: max_working_days_response,
					experiance_rule: experiance_rule,
					customer_prefered_period: customer_prefered_period
				}
			}
		};
		const business = await Businesses.findOneAndUpdate({ owner_id: req.user._id }, update, { new: true })
			.populate('categories')
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile');

		if (!business) return res.json({ error: 'Error accourd while updating' });

		res.status(200).json({ business });
	},
	getReviewsForProfilePage: async (req, res, next) => {
		const options = {
			page: req.params.page,
			limit: 10,
			collation: {
				locale: 'en'
			},
			sort: { 'customer_review.created_time': -1 },
			select: '-business_review',
			populate: { path: 'appointment_id', select: 'services', populate: { path: 'services', select: 'title' } }
		};
		const appointments = await Appointments.find({ business_id: req.params.business_id, status: 'done' }, '_id');
		// res.json({ reviews });
		const reviews = await Reviews.paginate(
			{ appointment_id: { $in: appointments }, 'customer_review.isRated': true },
			options
		);
		res.json({ reviews });
	},
	setfull: async (req, res, next) => {
		// const test = rateIncrement('5cedfa110a209a0eddbb2bbb');
		// res.json(test);
		const convert = (_id) => {
			console.log(_id);
			return mongoose.Types.ObjectId(_id);
		};
		const result = await Appointments.aggregate([
			{ $match: { status: 'done' } },
			{ $unwind: '$services' },
			/* stage to save the service_id before the join */
			{
				$addFields: {
					mainService: '$services'
				}
			},
			/* stage to join from business with the service to get the cost and the time */
			{
				$lookup: {
					from: 'businesses',
					localField: 'services',
					foreignField: 'services.service_id',
					as: 'services'
				}
			},
			/* stage to to get the join services[0]{which it a document of join and save it as a real document} */
			{
				$addFields: {
					allservices: { $arrayElemAt: ['$services', 0] }
				}
			},
			/* the stage to filter the results and keep the wanted varibales only */
			{
				$project: {
					date: '$time.date',
					business_id: '$business_id',
					services: {
						$filter: {
							input: '$allservices.services',
							as: 'item',
							cond: {
								$eq: ['$$item.service_id', '$mainService']
							}
						}
					}
				}
			},
			{ $unwind: '$services' },

			{
				$group: {
					_id: {
						date: '$date',
						business_id: '$business_id'
					},

					services: { $push: '$services' },
					count: { $sum: 1 }
				}
			},
			{
				$project: {
					_id: 0,
					business_id: '$_id.business_id',
					date: '$_id.date',
					totalCost: { $sum: '$services.cost' },
					totalTime: { $sum: '$services.time' },
					count: '$count'
				}
			}

			// }
			// }
			// {
			// 	$group : {
			// 		_id      : {
			// 			date        : '$time.date',
			// 			business_id : '$business_id'
			// 		},
			// 		services : { $push: '$services' },
			// 		count    : { $sum: 1 }
			// 	}
			// }
		]);
		// const business = await Businesses.find({}).populate('insights');
		res.json({ result });

		// const ressponse = await getbusinessAvgRatingByDateRange('5cedfa110a209a0eddbb2bbb');
		// res.json({ ressponse });
		// const users = await Categories.aggregate([
		// 	{
		// 		$group : {
		// 			_id      : '$services',
		// 			services : { $sum: 1 }
		// 		}
		// 	}
		// ]);
		// res.json({ users });
	}
};
