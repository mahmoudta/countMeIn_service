const {time_range} = require('../controllers/algs/free-alg')
const mongoose = require('mongoose'),
	freeTime = new mongoose.Schema({
        business_id:{
            type:String,
            required:true,
            unique:true
        },
        dates:[
            {
            day:{
                type:Date,

            },
            freeTime:[time_range]

        }
    ]
    });