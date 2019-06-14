const JWT = require('jsonwebtoken');
const Users = require('../models/user');
const Businesses = require('../models/business');
const Categories = require('../models/category');
const moment = require('moment');
const { JWT_SECRET } = require('../consts');
const { booked } = require('./algs/free-alg');
const { smart } = require('./algs/free-alg');
const { ifcanbook } = require('./algs/free-alg');
const { freeAlg } = require('./algs/free-alg');
const { aftereditingbusnessworkinghours } = require('./algs/free-alg');
const { zeroPad } = require('../utils/appointment.utils');
const isEmpty = require('lodash.isempty');
const mongoose = require('mongoose');

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');

signInToken = (user, business_id = '') => {
	return JWT.sign(
		{
			sub             : user._id,
			isAdmin         : user.isAdmin,
			profile         : user.profile,
			isBusinessOwner : !isEmpty(business_id) > 0 ? true : false,
			business_id     : business_id
		},
		JWT_SECRET
	);
};

module.exports = {
	signUp                   : async (req, res, next) => {
		console.log('signUp Called!!');

		const { email, password, first_name, last_name } = req.value.body;
		const user = await Users.findOne({ email });
		if (user) {
			return res.status(403).json({ message: 'user already exist' });
		}
		const newUser = new Users({
			_id     : new mongoose.Types.ObjectId(),
			method  : 'local',
			email   : email,
			local   : {
				password : password
			},
			profile : {
				name : {
					first : first_name,
					last  : last_name
				}
			}
		});
		await newUser.save();
		const token = signInToken(newUser);
		res.status(200).json({ token });
	},

	signIn                   : async (req, res, next) => {
		console.log('signIn Called!!');
		const business = await Businesses.findOne({ owner_id: req.user._id });
		let token;
		if (business) {
			token = signInToken(req.user, business._id);
		} else {
			token = signInToken(req.user);
		}

		// const isowner = business ? true : false;
		res.status(200).json({ token });
	},

	googleOAuth              : (req, res, next) => {
		const token = signInToken(req.user);
		res.status(200).json({ token });
	},

	secret                   : async (req, res, next) => {
		console.log('secret Called!!');
		// console.log(req.user);
		// console.log(req.user.user);
	},

	test                     : async (req, res, next) => {
		console.log('Test aftereditingbusnessworkinghours Here');
		var array = [ false, false, false, true, false, false, false ];
		//var date = await new Date(2019, 3, 28); // 2019/04/14 => "2019-04-13T21:00:00.000Z" ,months start from 0 so (april = month[3] )
		const test1 = await aftereditingbusnessworkinghours('5cedfa110a209a0eddbb2bbb', array);

		res.status(200).json({ result: test1 });
	},
	booktest                 : async (req, res, next) => {
		// console.log('book Test Here');
		const test1 = await smart(
			'5cedfa110a209a0eddbb2bbb',
			[ '5cedf5813e3dad305192241e' ],
			'5cedf3d20a209a0eddbb2bb2',
			1
		);
		res.status(200).json({ test1 });
	},
	databasetest             : async (req, res, next) => {
		console.log('database Test Here');
		var date1 = await new Date(2019, 5, 12);
		var date2 = await new Date(2019, 5, 12);
		const test1 = await freeAlg('5cedfa110a209a0eddbb2bbb', [ '5cedf5813e3dad305192241e' ], date1, date2);
		res.status(200).json({ test1 });
	},
	getUpcommingAppointments : async (req, res, next) => {
		let ResArray = new Array();
		//let services = new Array();

		console.log('user', req.user._id);
		const QueryRes = await Appointments.find({
			client_id : req.user._id
		})
			.populate({
				path     : 'services',
				populate : { path: 'services' }
			})
			.populate('business_id');

		console.log('queryQ', QueryRes);

		var promise = QueryRes.map(async (appointment, i) => {
			const BusinessName = appointment.business_id.profile.name;
			let shour = appointment.time.start._hour;
			let sminute = zeroPad(appointment.time.start._minute, 2);
			let thisdate = appointment.time.date;
			const services = await Promise.all(
				appointment.services.map(async (service) => {
					return await service.title;
				})
			);
			let time = shour.toString() + ':' + sminute.toString();
			ResArray = [ appointment.business_id._id, appointment._id, i + 1, BusinessName, time, thisdate, services ];

			//	ResArray.push(BusinessProfile.profile.name);
			//	console.log(ResArray);
			//console.log({ BusinessProfile });
			return ResArray;
		});
		console.log('res', ResArray);
		const FinalArray = await Promise.all(promise);
		console.log('Final'.FinalArray);
		res.json(FinalArray);
	},

	getFallowedBusinesses    : async (req, res, next) => {
		console.log(req.user._id);
		const businesses = await Users.findOne({ _id: req.user._id }).populate('following', 'profile');
		console.log(businesses.following);
		res.json({ following: businesses.following });
	},

	getAllBusinesses         : async (req, res, next) => {
		const businesses = await Businesses.find({}, 'profile');
		res.json({ businesses });
	},

	appendNotification       : async (req, res, next) => {
		const { title, type, my_business, appointment_id, status } = req.body;

		if (!isEmpty(appointment_id)) {
			const isAlreadyHere = await Users.find({
				'notification.appointment_id' : appointment_id,
				'notification.status'         : status
			});
			if (isAlreadyHere) return res.status(200).json({ notifications: isAlreadyHere });
		}
		let update = {
			$push : {
				notification : { title, Type: type, my_business, appointment_id }
			}
		};
		const user = await Users.findOneAndUpdate({ _id: req.user._id }, update, { new: true });
		if (!user) return res.json({ error: 'error accourd' });

		res.status(200).json({ notifications: user.notification });
	}
};

// exports.signIn = (req, res) => {
// 	Users.findOne({ 'profile.email': req.body.email, 'profile.password': req.body.password }, (err, User) => {
// 		if (err) {
// 			console.log('Some errors in sign in');
// 			res.status(404).json({ Error: err });
// 			return;
// 		}
// 		if (!User) {
// 			console.log('User Not Found');
// 			res.status(404).json({ Error: 'User Not Found' });
// 			return;
// 		}
// 		// const token = jwt.sign(
// 		// 	{
// 		// 		id: User.id,
// 		// 		username: User.profile.name.first,
// 		// 		img: User.profile.imgSrc
// 		// 	},
// 		// 	consts.jwtSecret
// 		// );
// 		res.json({ User });
// 		// req.session.user = User
// 		// res.json({User})
// 	});
// };
