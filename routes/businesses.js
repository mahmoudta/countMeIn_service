const express = require('express'),
	router = require('express-promise-router')();
const businessCtl = require('../controllers/businesses.ctl');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/getAllBusinesses').get(businessCtl.getAllBusinesses);
router.route('/').post(passportJWT, businessCtl.createBusiness).get(passportJWT, businessCtl.getAllBusinesses);
router.route('/getAllCustomers').get(passportJWT, businessCtl.getAllCustomers);
router.route('/:id').get(passportJWT, businessCtl.getBusinessForView);
router.route('/owner/:owner_id').get(passportJWT, businessCtl.getBusinessByOwner);
router.route('/follow').put(passportJWT, businessCtl.followBusiness);
router.route('/unfollow').put(passportJWT, businessCtl.unfollowBusiness);
router.route('/edit').put(passportJWT, businessCtl.editBusiness);
router.route('/services/:id').get(passportJWT, businessCtl.getServicesByBusiness);
router.route('/getBusinessesByCatagory/:catagoryId').get(passportJWT, businessCtl.getBusinessesByCatagory);
router.route('/UpdateSmartAlgorithmsSettings').put(passportJWT, businessCtl.UpdateSmartAlgorithmsSettings);
router.route('/statsHeader/:business_id').get(businessCtl.getBusinessStatsHeader);
router.route('/reviews/:business_id/:page').get(passportJWT, businessCtl.getReviewsForProfilePage);
router.route('/sumarryPage/:business_id/:range').get(passportJWT, businessCtl.getStatistics);
router.route('/appointmentsStats/:business_id').get(passportJWT, businessCtl.getAppointmentsStatistics);
router.route('/servicesStats/:business_id').get(passportJWT, businessCtl.getServiceStats);
router.route('/followersStats/:business_id').get(businessCtl.getFollowersStats);
router.route('/test/add').get(businessCtl.setfull);

module.exports = router;
