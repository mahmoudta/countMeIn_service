const express = require('express'),
	session = require('express-session'),
	morgan = require('morgan'),
	app = express(),
	bodyParser = require('body-parser');

/* Middlewares */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/', express.static('./public')); //for API
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
		return res.status(200).json({});
	}
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

	res.set('Content-Type', 'application/json');
	next();
});

// app.use(session({secret:'shjlowyi739d',resave: false, saveUninitialized:true}))

/*** All routes ***/
app.use('/users', require('./routes/users'));
app.use('/category', require('./routes/categories'));
app.use('/appointments', require('./routes/appointments'));
app.use('/business', require('./routes/businesses'));
app.use('/algorithms', require('./routes/algorithms'));
app.use('/sms', require('./routes/sms'));

/* start the server */
const port = process.env.PORT || 8080;
app.set('port', port);
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
