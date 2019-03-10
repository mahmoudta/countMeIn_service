var mongoose = require('mongoose'),
	user = new mongoose.Schema({
		profile: {
			email: String,
			password: String,
			name: {
				first: {
					type: String,
					require
				},
				last: String
			},
			imgUrl: String
		},
		appointments: [ String ],
		following: [ String ]
	});

user.path('profile.name.first').set((first) => {
	const newFirst = first.charAt(0).toUpperCase() + first.slice(1);
	console.log(`toLowerCase : ${newFirst}`);
	// let sVal = String(val).toLowerCase();
	return newFirst;
});

user.path('profile.name.last').set((last) => {
	const newLast = last.charAt(0).toUpperCase() + last.slice(1);
	console.log(`toLowerCase : ${newLast}`);
	// let sVal = String(val).toLowerCase();
	return newLast;
});

var User = mongoose.model('User', user);

module.exports = User;
