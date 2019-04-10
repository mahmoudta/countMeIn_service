var consts       = require('./consts'),
    mongoose     = require('mongoose');

//define the MODEL
var Businesses      = require('./models/business'),
    Users           = require('./models/user'),
    Appointments    = require('./models/appointment');
    options = {
        autoReconnect:true,
        useNewUrlParser: true

};
mongoose.connect(consts.MLAB,options)
.then(
    () => {
        console.log('connected');
    },
    err => {
        console.log(`connection error: ${err}`);
    }
);