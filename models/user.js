const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'),
	user = new mongoose.Schema({
		_id: { type: mongoose.Schema.Types.ObjectId },
		method: {
			type: String,
			enum: [ 'local', 'google' ],
			required: true
		},
		isAdmin: {
			type: Boolean,
			default: false,
			required: true
		},
		local: {
			password: String
		},
		google: {
			id: String
		},
		email: {
			type: String,
			lowercase: true
		},
		profile: {
			name: {
				first: {
					type: String,
					required: true
				},
				last: {
					type: String,
					default: ' '
				}
			},
			imgUrl: String,
			businessId: String
			//phone:phone number
		},
		//Notifaction:[]
		//globalExpreince:Number
		appointments: [ String ],
		following: [ String ]
	});

user.pre('save', async function(next) {
	if (this.method != 'local') {
		next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(this.local.password, salt);
		this.local.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

user.methods.isValidPassword = async function(newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.local.password);
	} catch (error) {
		throw new Error(error);
	}
};

user.path('profile.name.first').set((first) => {
	// const newFirst = first.toString().lowercase()
	const newFirst = first.toLowerCase().charAt(0).toUpperCase() + first.slice(1);
	console.log(`toLowerCase : ${newFirst}`);
	// let sVal = String(val).toLowerCase();
	return newFirst;
});

user.path('profile.name.last').set((last) => {
	if (last) {
		const newLast = last.lowercase().charAt(0).toUpperCase() + last.slice(1);
		console.log(`toLowerCase : ${newLast}`);
		// let sVal = String(val).toLowerCase();
		return newLast;
	}
});

var User = mongoose.model('User', user);

module.exports = User;
