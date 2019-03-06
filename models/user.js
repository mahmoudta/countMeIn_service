var mongoose        =   require('mongoose'),
    user          =   new mongoose.Schema({
	ID:String,
	profile:{
		name:{
			first:String,
			last:String
		},
		imgUrl:String,
	},
	appointments:[String],
	following:[String], 
});

var User  = mongoose.model('User',user);

module.exports = User; 
 