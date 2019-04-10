const JWT = require('jsonwebtoken');
const Users = require('../models/user');
const Businesses = require('../models/business');
const moment = require('moment');
const { JWT_SECRET } = require('../consts');
const { booked } = require('./algs/free-alg');
const { ifcanbook } = require('./algs/free-alg');
const { freeAlg} = require('./algs/free-alg');

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');

signInToken = (user) => {
	return JWT.sign(
		{
			sub: user._id,
			isAdmin: user.isAdmin,
			profile: user.profile
		},
		JWT_SECRET
	);
};
module.exports = {
	signUp: async (req, res, next) => {
		console.log('signUp Called!!');

		const { email, password, first_name, last_name } = req.value.body;
		const user = await Users.findOne({ email });
		if (user) {
			return res.status(403).json({ message: 'user already exist' });
		}
		const newUser = new Users({
			method: 'local',
			email: email,
			local: {
				password: password
			},
			profile: {
				name: {
					first: first_name,
					last: last_name
				}
			}
		});
		await newUser.save();
		const token = signInToken(newUser);
		res.status(200).json({ token });
	},

	signIn: async (req, res, next) => {
		console.log('signIn Called!!');
		const token = signInToken(req.user);
		res.status(200).json({ token });
	},

	googleOAuth: (req, res, next) => {
		const token = signInToken(req.user);
		res.status(200).json({ token });
	},

	secret: async (req, res, next) => {
		console.log('secret Called!!');
		// console.log(req.user);
		// console.log(req.user.user);
	},

	test: async (req, res, next) => {
		console.log('Test ifcanbook Here');
		var timerange={
			"_start":{"_hour":11, "_minute":00},
			"_end":{"_hour":18,"_minute":00}
		  }
		var date=await new Date(2019, 3, 28);// 2019/04/14 => "2019-04-13T21:00:00.000Z" ,months start from 0 so (april = month[3] )
		const test1 = await ifcanbook('5ca5210fa3e1e23000ac29dd',date,timerange);
		
		res.status(200).json({ result: test1 });
	},
	booktest: async (req, res, next) => {
		console.log('book Test Here');
		var timerange={
						"_start":{"_hour":11, "_minute":40},
						"_end":{"_hour":12,"_minute":20}
					  }
		var date=await new Date(2019, 3, 14);// 2019/04/14 => "2019-04-13T21:00:00.000Z" ,months start from 0 so (april = month[3] )
		//console.log(date);
		const test1 = await booked('5ca5210fa3e1e23000ac29dd',date,timerange);
		res.status(200).json({ test1 });
	},
	databasetest: async (req, res, next) => {
		console.log('database Test Here');
		var date1=await new Date(2019, 3, 14);
		var date2=await new Date(2019, 3, 28);
		const test1 = await freeAlg('5ca5210fa3e1e23000ac29dd',['5ca530337fd30731bbc006dc'],date1,date2,0);
		res.status(200).json({ test1 });
	},

	getAllBusinesses: async (req, res, next) => {
		const businesses = await Businesses.find({}, 'profile');
		res.json({ businesses });
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
