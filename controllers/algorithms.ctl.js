const JWT = require('jsonwebtoken');
const { freeAlg, smart } = require('./algs/free-alg');

// const Categories = require('../models/category');
// const Businesses = require('../models/business');

// const { JWT_SECRET } = require('../consts');

module.exports = {
	getFreeTime: async (req, res, next) => {
		const { business, services, date_from, date_until } = req.body;
		/* create date witth minus 3 hours */
		//TODO fix the database time to israeli
		const dateFrom = await new Date(new Date(date_from).getTime() - 60 * 60 * 3 * 1000);
		const dateUntil = await new Date(new Date(date_until).getTime() - 60 * 60 * 3 * 1000);

		const dates = await freeAlg(business, services, dateFrom, dateUntil, 0);
		if (dates.error) return res.status(404).json({ error: dates.error });

		res.status(200).json({ dates });
	},

	getSmartTime: async (req, res, next) => {
		//Smart ( businessID , servicesesArray , customerID ,
		//preferhours 0 moring / 1 12-18 / 3/evening ,
		//True/false check if ur availble by business appointments default true,
		//true/false Customer Deside date ,
		//DateFrom ,
		//Date|Until,
		//true/false Customer experience ,
		// default 5 value of no space ,
		//value of preferhours ,
		//valueofbusiness busy hours ,
		// days to search,
		//free days to return
		const {
			businessId,
			servicesArr,
			customerId,
			ifCustomer,
			timeScope,
			customerExpEffect,
			noSpaceEffect,
			timeScopeEffect,
			busyHoursEffect,
			daysToSearch,
			daysToReturn
		} = req.body;

		console.log(
			'businessId',
			businessId,
			'servicesArr',
			servicesArr,
			'customerId',
			customerId,
			'timeScop',
			timeScope
		);
		const smartData = await smart(businessId, servicesArr, customerId, timeScope, true); // Edit it later to add extra options
		if (smartData.error) return res.status(404).json({ error: smartData.error });
		res.status(200).json({ smartData });
	}
};
