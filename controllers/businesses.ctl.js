const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../consts');
const moment = require('moment');

const Businesses = require('../models/business');
const Categories = require('../models/category');
const Appointments = require('../models/appointment');
const Reviews = require('../models/review');
const insights = require('../models/insight');
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
	followClickIncrement,
	servicesDayStatistics,
	createInsights,
	createAppointmentsInsights,
	createTotalFollowersCount
} = require('./functions/business.funcs');

const mongoose = require('mongoose');

signInToken = (user, business_id = '') => {
	return JWT.sign(
		{
			sub             : user._id,
			isAdmin         : user.isAdmin,
			profile         : user.profile,
			isBusinessOwner : !isEmpty(business_id) ? true : false,
			business_id     : business_id
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

	getBusinessesByCatagoryArray  : async (req, res, next) => {
		const { catagoryIdArray } = req.body;
		const ResultQuery = [ 'empty' ];
		catagoryIdArray.forEach(async (value, i) => {
			ResultQuery = await Businesses.find(
				{
					'profile.category_id' : value
				},
				'_id'
			);
		});
		res.status(200).json({ ResultQuery });
	},

	getAllCustomers               : async (req, res, next) => {
		const business = await Businesses.findOne({ owner_id: req.user._id }, 'customers.customer_id');
		if (!business) return res.status(404).json({ error: 'business not found' });
		const ids = await business.customers.map((customer) => {
			return customer.customer_id;
		});

		const customers = await Users.find({ _id: { $in: ids } }, 'profile.name');

		if (!customers) return res.status(404).json({ error: 'an error occurred' });

		res.status(200).json({ customers });
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
	getBusinessesByCatagory       : async (req, res, next) => {
		const { catagoryId } = req.params;
		//var catagoryId = JSON.parse(req.params);

		const business = await Businesses.find(
			{
				categories : mongoose.Types.ObjectId(catagoryId)
			},
			'profile'
		);

		res.status(200).json({ business });
	},

	getAllBusinesses              : async (req, res, next) => {
		const businesses = await Businesses.find({});
		if (!businesses) return res.status(404).json({ error: 'not found' });
		res.status(200).json({ businesses });
	},

	/* Adhamm */
	getBusinessForView            : async (req, res, next) => {
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

	getBusinessByOwner            : async (req, res, next) => {
		const owner_id = req.params.owner_id;
		const business = await Businesses.findOne({ owner_id: owner_id })
			.populate({ path: 'categories', populate: { path: 'services' } })
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile')
			.lean();
		if (!business) return res.status(400).json({ error: 'Business Not Found' });
		// const categories = await Categories.find({ _id: { $in: 'business.categories' } }).populate('services', 'title');
		// business.categories = categories;

		res.status(200).json({ business });
	},

	createBusiness                : async (req, res, next) => {
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
					day    : element.day,
					opened : element.opened,
					from   : from,
					until  : until,
					break  : {
						isBreak : element.break.isBreak ? true : false,
						from    : await createTime(element.break.from),
						until   : await createTime(element.break.until)
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
				service_id : mongoose.Types.ObjectId(service.value),
				time       : Number(service.time),
				cost       : Number(service.cost)
			};
		});
		const newBusiness = new Businesses({
			_id           : new mongoose.Types.ObjectId(),
			owner_id      : mongoose.Types.ObjectId(req.user._id),
			profile       : {
				name        : name,
				img         : !isEmpty(img) ? img : '',
				location    : {
					street      : !isEmpty(street) ? street : '',
					city        : !isEmpty(city) ? city : '',
					building    : !isEmpty(building) ? Number(building) : 0,
					postal_code : !isEmpty(postal_code) ? Number(postal_code) : 0
				},
				phone       : phone,
				description : !isEmpty(description) ? description : ''
			},
			services      : NewServices,
			categories    : NewCategories,
			working_hours : await fillTime(),
			break_time    : !isEmpty(breakTime) ? breakTime : 10
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

	editBusiness                  : async (req, res, next) => {
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
					day    : element.day,
					opened : element.opened,
					from   : from,
					until  : until,
					break  : {
						isBreak : element.break.isBreak ? true : false,
						from    : await createTime(element.break.from),
						until   : await createTime(element.break.until)
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
				service_id : mongoose.Types.ObjectId(service.value),
				time       : Number(service.time),
				cost       : Number(service.cost)
			};
		});
		const updateBusiness = {
			$set          : {
				'profile.name'        : name,
				'profile.img'         : !isEmpty(img) ? img : '',
				'profile.location'    : {
					street      : !isEmpty(street) ? street : '',
					city        : !isEmpty(city) ? city : '',
					building    : !isEmpty(building) ? Number(building) : 0,
					postal_code : !isEmpty(postal_code) ? Number(postal_code) : 0
				},
				'profile.phone'       : phone,
				'profile.description' : !isEmpty(description) ? description : ''
			},

			services      : NewServices,
			categories    : NewCategories,
			working_hours : await fillTime(),
			break_time    : !isEmpty(breakTime) ? breakTime : 10
		};

		let business = await Businesses.findOneAndUpdate({ _id: business_id }, updateBusiness, {
			setDefaultsOnInsert : true,
			new                 : true,
			useFindAndModify    : false
		})
			.populate('categories')
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile');
		if (!business) return res.status(403).json({ error: 'some error accourd during update' });

		/* send the working edits array to free time tree to make a changes on the tree. */
		//console.log(working_edits);
		aftereditingbusnessworkinghours(business._id, working_edits);
		res.status(200).json({ business });
	},

	followBusiness                : async (req, res, next) => {
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
				$set : {
					'customers.$.isFollower' : true
				},
				$inc : { 'customers.$.experiance': 2 }
			};
		} else {
			/* else : the user is exists in the follower list we should only update the flag to follower.*/
			business_query = { _id: business_id };
			business_update = {
				$push : {
					customers : {
						customer_id : mongoose.Types.ObjectId(req.user._id),
						isFollower  : true,
						experiance  : 3
					}
				}
			};
		}

		/* make the update to the business */
		const new_business = await Businesses.findOneAndUpdate(business_query, business_update);

		if (!new_business) return res.status(304).json({ error: 'error occourd while updating' });

		/* if the update successfully done */
		const userUpdate = {
			$push : {
				following : mongoose.Types.ObjectId(business_id)
			}
		};
		/* push business id to business */
		const updated_user = await Users.findOneAndUpdate({ _id: req.user._id }, userUpdate);
		followClickIncrement(business_id);
		// if (!updated_business) return res.status(404).json({ error: 'an error occurred' });

		res.status(200).json({ isFollower: true });
	},

	unfollowBusiness              : async (req, res, next) => {
		const { business_id } = req.body;
		// check if business
		const business = await Businesses.findById(business_id)
			.populate('services.service_id', 'title')
			.populate('categories', 'name');

		if (!business) return res.status(404).json({ error: 'business Not Found' });

		//unfollow
		const update = {
			$set : {
				'customers.$.isFollower' : false
			},
			$inc : { 'customers.$.experiance': -3 }
		};

		const userUpdate = {
			$pull : {
				following : mongoose.Types.ObjectId(business_id)
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
	getAllCustomers               : async (req, res, next) => {
		const business = await Businesses.findOne({ owner_id: req.user._id }, 'customers.customer_id');
		if (!business) return res.status(404).json({ error: 'business not found' });
		const ids = await business.customers.map((customer) => {
			return customer.customer_id;
		});

		const customers = await Users.find({ _id: { $in: ids } }, 'profile.name');

		if (!customers) return res.status(404).json({ error: 'an error occurred' });

		res.status(200).json({ customers });
	},
	getServicesByBusiness         : async (req, res, next) => {
		const { id } = req.params;
		const business = await Businesses.findById(id).populate('services.service_id', 'title');

		//console.log("service", business)
		if (!business) return res.status(404).json({ error: 'business not found' });
		const ids = await business.services.map((service) => {
			return {
				title : service.service_id.title,
				id    : service.service_id._id,
				cost  : service.cost,
				time  : service.time
			};
		});

		//console.log("service", ids)

		//if (!services) return res.status(404).json({ error: 'an error occurred' });
		res.status(200).json({ ids });
	},
	getBusinessStatsHeader        : async (req, res, next) => {
		const id = mongoose.Types.ObjectId(req.params.business_id);
		let today = moment(new Date(), 'l');
		let lastWeekStart = moment(moment(today).subtract('8', 'days'), 'l');

		const header = await insights.aggregate([
			{
				$match : {
					business_id : id,
					date        : { $gte: lastWeekStart.toDate(), $lte: today.toDate() }
				}
			},
			{
				$project : {
					total_time        : { $ifNull: [ '$total_time', 0 ] },
					total_earnings    : { $ifNull: [ '$total_earnings', 0 ] },
					done_appointments : { $ifNull: [ '$done_appointments', 0 ] }
				}
			},
			{
				$group : {
					_id               : null,
					total_time        : { $sum: '$total_time' },
					total_earnings    : { $sum: '$total_earnings' },
					done_appointments : { $sum: '$done_appointments' }
				}
			}
		]);
		if (isEmpty(header)) return res.status(300).json({ error: 'No data found' });
		let pastStart = moment(moment(today).subtract('7', 'days'), 'l');
		let pastEnd = moment(moment(pastStart).subtract('8', 'days'), 'l');
		const lastHeader = await insights.aggregate([
			{
				$match : {
					business_id : id,
					date        : { $gte: pastEnd.toDate(), $lte: pastStart.toDate() }
				}
			},
			{
				$project : {
					total_time        : { $ifNull: [ '$total_time', 0 ] },
					total_earnings    : { $ifNull: [ '$total_earnings', 0 ] },
					done_appointments : { $ifNull: [ '$done_appointments', 0 ] }
				}
			},
			{
				$group : {
					_id                 : null,
					l_total_time        : { $sum: '$total_time' },
					l_total_earnings    : { $sum: '$total_earnings' },
					l_done_appointments : { $sum: '$done_appointments' }
				}
			}
		]);
		let obj = header[0];
		Object.keys(lastHeader[0]).forEach(function(key) {
			obj[key] = lastHeader[0][key];
		});

		res.json({ header: obj });
	},
	UpdateSmartAlgorithmsSettings : async (req, res, next) => {
		const {
			customers_exp,
			continuity,
			distrbuted_time,
			days_calculate_length,
			max_working_days_response,
			customer_prefered_period,
			experiance_rule,
			max_days_to_return,
			morning,
			afternoon,
			evening
		} = req.body;
		update = {
			$set : {
				schedule_settings : {
					customers_exp             : customers_exp,
					continuity                : continuity,
					distrbuted_time           : distrbuted_time,
					days_calculate_length     : days_calculate_length,
					max_working_days_response : max_working_days_response,
					experiance_rule           : experiance_rule,
					customer_prefered_period  : customer_prefered_period,
					max_days_to_return        : max_days_to_return,
					range_definition          : {
						morning   : morning,
						// 'morning._end'     : morning._end,
						// 'afternoon._end'   : afternoon._end,
						afternoon : afternoon,
						// 'evning._end'   : evning._end,
						evening   : evening
					}
				}
			}
		};
		const business = await Businesses.findOneAndUpdate({ owner_id: req.user._id }, update, {
			new              : true,
			useFindAndModify : false
		})
			.populate('categories')
			.populate('services.service_id', 'title')
			.populate('customers.customer_id', 'profile');

		if (!business) return res.json({ error: 'Error accourd while updating' });

		res.status(200).json({ business });
	},
	getReviewsForProfilePage      : async (req, res, next) => {
		const options = {
			page      : req.params.page,
			limit     : 10,
			collation : {
				locale : 'en'
			},
			sort      : { 'customer_review.created_time': -1 },
			select    : '-business_review',
			populate  : { path: 'appointment_id', select: 'services', populate: { path: 'services', select: 'title' } }
		};
		const appointments = await Appointments.find({ business_id: req.params.business_id, status: 'done' }, '_id');
		// res.json({ reviews });
		const reviews = await Reviews.paginate(
			{ appointment_id: { $in: appointments }, 'customer_review.isRated': true },
			options
		);
		res.json({ reviews });
	},
	getStatistics                 : async (req, res, next) => {
		const { business_id, range } = req.params;
		let date, minDate, minPast;
		date = new Date(moment().format('YYYY/MM/DD'));
		let divider = 0;
		let array = [];
		switch (range) {
			case '7': {
				divider = 7;
				minDate = moment(date).subtract(8, 'days').format('YYYY/MMM/DD');
				minPast = moment(date).subtract(15, 'days').format('YYYY/MMM/DD');
				break;
			}
			default:
				return res.json({ error: 'invalid time range' });
		}

		const documents = await insights.aggregate([
			{
				$match : {
					business_id : mongoose.Types.ObjectId(business_id),
					date        : { $gt: new Date(minDate), $lt: date }
				}
			},
			{ $sort: { date: 1 } },

			{
				$addFields : {
					str_date    : {
						$concat : [
							{ $substr: [ { $add: [ 1, { $dayOfMonth: '$date' } ] }, 0, 2 ] },
							'-',
							{ $substr: [ { $month: '$date' }, 0, 2 ] },
							'-',
							{ $substr: [ { $year: '$date' }, 0, 4 ] }
						]
					},
					range_total : {
						total_time        : '$total_time',
						total_earnings    : '$total_earnings',
						done_appointments : '$done_appointments',
						average_rate      : '$rating_sum',
						profile_views     : '$profile_views'
					}
				}
			},

			{
				$project : {
					total_time        : [ '$str_date', { $ifNull: [ '$total_time', 0 ] } ],
					total_earnings    : [ '$str_date', { $ifNull: [ '$total_earnings', 0 ] } ],
					average_rate      : [
						'$str_date',
						{
							$divide : [
								'$rating_sum',
								{ $cond: [ { $lt: [ '$rating_count', 1 ] }, 1, '$rating_count' ] }
							]
						}
					],
					profile_views     : [ '$str_date', '$profile_views' ],
					done_appointments : [ '$str_date', { $ifNull: [ '$done_appointments', 0 ] } ],
					range_total       : 1
				}
			},
			{
				$group : {
					_id                : null,

					total_time         : { $push: '$total_time' },
					total_earnings     : { $push: '$total_earnings' },
					average_rate       : { $push: '$average_rate' },
					profile_views      : { $push: '$profile_views' },
					done_appointments  : { $push: '$done_appointments' },
					// total_range       : {},

					Ftotal_time        : { $sum: '$range_total.total_time' },
					Ftotal_earnings    : { $sum: '$range_total.total_earnings' },
					Fdone_appointments : { $sum: '$range_total.done_appointments' },
					Faverage_rate      : { $sum: '$range_total.average_rate' },
					Fprofile_views     : { $sum: '$range_total.profile_views' }
				}
			}

			// }
			// {
			// 	$group : {
			// 		_id            : null,
			// 		total_earnings : { $push: { $date: '$total_earnings' } }
			// 	}
			// }
		]);
		if (!documents) return res.status(304).json({ error: 'no data' });
		const pastRange = await insights.aggregate([
			{
				$match : {
					business_id : mongoose.Types.ObjectId(business_id),
					date        : {
						$gt : new Date(minPast),
						$lt : new Date(moment(minDate).add(1, 'day').format('YYYY/MM/DD'))
					}
				}
			},
			{
				$group : {
					_id                : null,
					total_time         : { $sum: '$total_time' },
					total_earnings     : { $sum: '$total_earnings' },
					done_appointments  : { $sum: '$done_appointments' },
					rating_count       : { $sum: '$rating_count' },
					rating_sum         : { $sum: '$rating_sum' },
					recommendation_sum : { $sum: '$recommendation_sum' },
					profile_views      : { $sum: '$profile_views' }
				}
			}
		]);
		res.status(200).json({ statistics: { current: documents[0], past: pastRange[0] } });
	},
	getAppointmentsStatistics     : async (req, res, next) => {
		const business_id = mongoose.Types.ObjectId(req.params.business_id);
		let date = moment().format('l');
		let week = new Date(moment().subtract(8, 'days').format('l'));

		const documents = await insights.aggregate([
			{
				$match : {
					business_id : business_id,
					date        : {
						$gt : week,
						$lt : new Date(date)
					}
				}
			},
			{ $unwind: '$traffic' },
			{
				$addFields : {
					name : '$traffic.time',
					y    : '$traffic.count',
					x    : {
						$dayOfWeek : {
							date     : '$date',
							timezone : '+0300'
						}
					}
				}
			},
			{
				$group : {
					_id : {
						name : '$name',
						x    : '$x'
					},
					y   : { $sum: '$y' }
				}
			},
			{ $sort: { '_id.name': 1, '_id.x': 1 } },
			{
				$group : {
					_id  : {
						name : '$_id.name'
					},
					data : {
						$push : { x: '$_id.x', y: '$y' }
					}
				}
			},
			{
				$project : {
					_id  : 0,
					name : '$_id.name',
					data : 1
				}
			},
			{ $sort: { name: 1 } }
		]);

		let hour = 0;
		let results = [];
		while (hour < 24) {
			let name = '';
			if (hour < 10) {
				name = `0${hour}`;
			} else {
				name = hour;
			}
			let data = [
				{ x: 'Sun', y: 0 },
				{ x: 'Mon', y: 0 },
				{ x: 'Tue', y: 0 },
				{ x: 'Wed', y: 0 },
				{ x: 'Thu', y: 0 },
				{ x: 'Fri', y: 0 },
				{ x: 'Sat', y: 0 }
			];
			results.push({ name, data });
			hour++;
		}

		const bb = await documents.forEach(async (hour) => {
			await hour.data.forEach((day) => {
				results[hour.name].data[day.x - 1].y = day.y;
			});
		});

		const comparison = await insights.aggregate([
			{
				$match : {
					business_id : business_id,
					date        : {
						$lt : new Date(moment(new Date()).format('l')),
						$gt : new Date(moment(new Date()).subtract(8, 'days').format('l'))
					}
				}
			},
			{ $sort: { date: 1 } },
			{
				$project : {
					done_appointments   : { $ifNull: [ '$done_appointments', 0 ] },
					passed_appointments : { $ifNull: [ '$passed_appointments', 0 ] },
					total_appointments  : { $ifNull: [ '$total_appointments', 0 ] }
				}
			},
			{
				$group : {
					_id    : null,
					done   : { $push: '$done_appointments' },
					passed : { $push: '$passed_appointments' },
					total  : { $push: '$total_appointments' }
				}
			}
		]);

		/* making sure that it fits all the hours and all days */
		res.json({ appointmntsStats: await results, comparison: comparison[0] });
	},
	getServiceStats               : async (req, res, next) => {
		let id = mongoose.Types.ObjectId(req.params.business_id);

		const results = await Appointments.aggregate([
			//TODO - ADD to pipleine to avoid double quers
			{ $match: { status: 'done', business_id: id } },
			{ $unwind: '$services' },
			/* stage to save the service_id before the join */
			{
				$addFields : {
					mainService : '$services'
				}
			},
			/* stage to join from business with the service to get the cost and the time */
			{
				$lookup : {
					from         : 'businesses',
					localField   : 'services',
					foreignField : 'services.service_id',
					as           : 'services'
				}
			},
			/* stage to to get the join services[0]{which it a document of join and save it as a real document} */
			{
				$addFields : {
					allservices      : { $arrayElemAt: [ '$services', 0 ] },
					appointment_time : {
						$add : [
							{ $multiply: [ { $subtract: [ '$time.end._hour', '$time.start._hour' ] }, 60 ] },
							{ $subtract: [ '$time.end._minute', '$time.start._minute' ] }
						]
					},
					real_time        : { $subtract: [ '$time.check_out', '$time.check_in' ] }
				}
			},

			/* the stage to filter the results and keep the wanted varibales only */
			{
				$project : {
					appointment_time : { $subtract: [ '$appointment_time', '$allservices.break_time' ] },
					real_time        : { $divide: [ '$real_time', 60 * 1000 ] },
					// check_in   : '$time.check_in',
					// real_time  : { $subtract: [ '$time.checkout', '$time.check_in' ] },
					services         : {
						$filter : {
							input : '$allservices.services',
							as    : 'item',
							cond  : {
								$eq : [ '$$item.service_id', '$mainService' ]
							}
						}
					}
				}
			},
			{ $unwind: '$services' },
			{
				$addFields : {
					time_diff : {
						$divide : [ { $subtract: [ '$real_time', '$appointment_time' ] }, '$appointment_time' ]
					}
				}
			},
			{
				$group : {
					_id          : {
						service_id : '$services.service_id',
						time       : '$services.time',
						cost       : '$services.cost'
					},
					appointments : { $push: '$time_diff' },
					// time         : { $add: [ '$services.time', 0 ] },
					count        : { $sum: 1 }
				}
			},
			{
				$lookup : {
					from         : 'services',
					localField   : '_id.service_id',
					foreignField : '_id',
					as           : 'newService'
				}
			},
			{ $unwind: '$newService' },
			{
				$project : {
					_id    : '$_id.service_id',
					change : { $divide: [ { $multiply: [ { $sum: '$appointments' }, '$_id.time' ] }, '$count' ] },
					profit : { $multiply: [ '$_id.cost', '$count' ] },
					time   : '$_id.time',
					count  : '$count',
					title  : '$newService.title'
				}
			},
			{ $sort: { count: -1 } }
		]);
		res.json({ results });
	},
	getFollowersStats             : async (req, res, next) => {
		await createTotalFollowersCount();
		const id = mongoose.Types.ObjectId(req.params.business_id);

		const results = await insights.aggregate([
			{
				$match : {
					business_id : id,
					date        : {
						$gt : week,
						$lt : new Date(date)
					}
				}
			},
			{
				$addFields : {
					followers : { $ifNull: [ '$total_followers', 0 ] },
					str_date  : {
						$concat : [
							{ $substr: [ { $add: [ 1, { $dayOfMonth: '$date' } ] }, 0, 2 ] },
							'-',
							{ $substr: [ { $month: '$date' }, 0, 2 ] }
						]
					}
				}
			},
			{
				$project : {
					_id       : null,
					date      : '$date',
					graph     : [ '$date', '$follow', '$unfollow' ],
					follow    : { $ifNull: [ '$follow', 0 ] },
					unfollow  : { $ifNull: [ '$unfollow', 0 ] },
					followers : '$followers'
				}
			},
			{ $sort: { date: 1 } }
		]);
		res.json({ results });
	},

	setfull                       : async (req, res, next) => {
		const test = await createAppointmentsInsights();
		res.json({ test });
		// res.json({ success: 'success' });
		// servicesDayStatistics();
	}
};
