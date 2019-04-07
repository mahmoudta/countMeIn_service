const express = require('express'),
	router = require('express-promise-router')();
const businessCtl = require('../controllers/businesses.ctl');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/').post(passportJWT, businessCtl.createBusiness).get(passportJWT, businessCtl.getAllBusinesses);
router.route('/:id').put(passportJWT, businessCtl.editBusiness);
router.route('/:id').get(passportJWT, businessCtl.getBusinessForView);
router.route('/owner/:owner_id').get(passportJWT, businessCtl.getBusinessByOwner);
module.exports = router;
