const JWT = require('jsonwebtoken');
const Users = require('../models/user');
const { JWT_SECRET } = require('../consts');
const {freeTimeAlg} = require('./algs/free-alg')

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');

signToken = (user) => {
	return JWT.sign(
		{
			iss: 'CountMeIn',
			sub: user._id
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
			'local.password': password,
			profile: {
				name: {
					first: first_name,
					last: last_name
				}
			}
		});
		await newUser.save();
		const token = signToken(newUser);
		res.status(200).json({ token });
	},

	signIn: async (req, res, next) => {
		console.log('signIn Called!!');
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	googleOAuth: (req, res, next) => {
		const token = signInToken(req.user);
		res.status(200).json({ token });
	},

	secret: async (req, res, next) => {
		console.log('secret Called!!');
	},

	test : async (req,res,next)=>{
		console.log('Test Here');
		const test1 =  freeTimeAlg(11);
		res.json({test1});
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
