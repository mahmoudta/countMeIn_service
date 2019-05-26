const express = require('express'),
	router = require('express-promise-router')();
const businessCtl = require('../controllers/businesses.ctl');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/').post(passportJWT, businessCtl.createBusiness).get(passportJWT, businessCtl.getAllBusinesses);
router.route('/getAllCustomers').get(passportJWT, businessCtl.getAllCustomers);
router.route('/:id').get(passportJWT, businessCtl.getBusinessForView);
router.route('/owner/:owner_id').get(passportJWT, businessCtl.getBusinessByOwner);
router.route('/follow').put(passportJWT, businessCtl.followBusiness);
router.route('/unfollow').put(passportJWT, businessCtl.unfollowBusiness);
router.route('/edit').put(passportJWT, businessCtl.editBusiness);
router.route('/services/:id').get(passportJWT, businessCtl.getServicesByBusiness);
router.route('/getBusinessesByCatagory/:catagoryId').get(passportJWT, businessCtl.getBusinessesByCatagory);
router.route('/test/add').get(businessCtl.setfull);

module.exports = router;
