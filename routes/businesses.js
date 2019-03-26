const express = require('express'),
	router = require('express-promise-router')();
const businessCtl = require('../controllers/businesses.ctl');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/').post(passportJWT, businessCtl.createBusiness);
module.exports = router;
