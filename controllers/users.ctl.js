const mongoose = require('mongoose');
var Users = require('../models/user');

exports.signIn = (req, res) => {
	Users.findOne({ 'profile.email': req.body.email, 'profile.password': req.body.password }, (err, User) => {
		if (err) {
			console.log('Some errors in sign in');
			res.status(404).json({ Error: err });
			return;
		}
		if (!User) {
			console.log('User Not Found');
			res.status(404).json({ Error: 'User Not Found' });
			return;
		}
		// const token = jwt.sign(
		// 	{
		// 		id: User.id,
		// 		username: User.profile.name.first,
		// 		img: User.profile.imgSrc
		// 	},
		// 	consts.jwtSecret
		// );
		res.json({ User });
		// req.session.user = User
		// res.json({User})
	});
};
