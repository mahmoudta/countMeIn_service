const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	// userCtl     = require('./controllers/users.ctl'),
	// debateCtl   = require('./controllers/debates.ctl'),
	port = process.env.PORT || 8080;
// session     = require('express-session');
app.set('port', port);
app.use('/', express.static('./public')); //for API
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
	res.set('Content-Type', 'application/json');
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({secret:'shjlowyi739d',resave: false, saveUninitialized:true}))

/*** All routes ***/

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
