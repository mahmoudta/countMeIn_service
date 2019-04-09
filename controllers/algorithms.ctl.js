const JWT = require('jsonwebtoken');
const freeAlg = require('./algs/free-alg');
// const Categories = require('../models/category');
// const Businesses = require('../models/business');

// const { JWT_SECRET } = require('../consts');

module.exports = {
	getFreeTime: async(req,res,next)=>{
        const {business_id,service_id } = req.body;
        const dates = await freeAlg(business_id,service_id);
        if(dates.error) return res.status(404).json({"error": dates.error});

        res.status(200).json({dates});
    }
};
