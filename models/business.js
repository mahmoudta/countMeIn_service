var mongoose        =   require('mongoose'),
    business        =   new mongoose.Schema({
		Schedule_id:String, /*the Schedule id for this bussniess*/
		owner_id:String,/* id of client that owns this bussniess*/
		profile:{
			name:String,
			catageory:String,
			rating:Number,
			working_hours:[{/* array which length = 7 (week)*/
			day:String,
			from:Date,
			until:Date
		}],
			location:{
			street:String,
			city:String,
			building:Number,
			postal_code:Number
		}
		}/*end of profile*/,
		style_id:String, /* id for style document*/
		followers:[{
			client_id:String,
			experiance:Number
			}] /* array of Clients_ids */
	});

	var Business  	= mongoose.model('Business',business);

	module.exports 	= Business; 
