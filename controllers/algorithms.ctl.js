const JWT = require('jsonwebtoken');
const { freeAlg } = require('./algs/free-alg');
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
	}
};
