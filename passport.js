const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const { JWT_SECRET } = require('./consts');
const User = require('./models/user');
/* JSON WEB TOKEN STRATEGY */
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader('authorization'),
			secretOrKey: JWT_SECRET
		},
		async (payload, done) => {
			try {
				const user = await User.findOne({ _id: payload.sub });

				if (!user) {
					return done(null, false);
				}

				return done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);
// passport.use(
// 	new JwtStrategy(
// 		{
// 			jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
// 			secretOrKey: JWT_SECRET
// 		},
// 		async (payload, done) => {
// 			try {
// 				const user = User.findById(payload.sub);
// 				if (!user) {
// 					return done(null, false);
// 				}
// 				done(null, user);
// 			} catch (error) {
// 				done(error, false);
// 			}
// 		}
// 	)
// );

/* LOCAL STRATEGY */
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email'
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false);
				}
				const isMatch = await user.isValidPassword(password);

				if (!isMatch) {
					return done(null, false);
				}
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

/* GOOGLE OAUTH STRATEGY */
passport.use(
	'googleToken',
	new GooglePlusTokenStrategy(
		{
			clientID: '898502471554-egsp6qj1b9fhd9v6ultp6ar722n3qg01.apps.googleusercontent.com',
			clientSecret: 'abjfsTOUp5BaKS-G4K8lEWb7'
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				console.log('accessToken', accessToken);
				console.log('refreshToken', refreshToken);
				console.log('profile', profile);

				/* IF USER EXISTS */
				const existingUser = await User.findOne({ 'google.id': profile.id });
				if (existingUser) return done(null, existingUser);

				/* IF NEW ACCOUNT */
				const newUser = new User({
					method: 'google',
					email: profile.emails[0].value,
					google: {
						id: profile.id
					}
				});
				await newUser.save();
				done(null, newUser);
			} catch (error) {
				done(error, false, error.message);
			}
		}
	)
);
