// to run this we should run "source ./twilio.env" in terminal
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;




module.exports = {
	Verfy: (req, res, next) => {
		client.verify
			.services(serviceId)
			.verifications.create({ to: req.body.phone, channel: 'sms' })
			.then((verification) => res.json(verification.sid));
	},

	CheckVerfy: (req, res, next) => {
		client.verify
			.services(serviceId)
			.verificationChecks.create({ to: req.body.phone, code: req.body.code })
			.then((verification_check) => res.json(verification_check.status));
	},

	// handleReviewSms: (req, res) => {
	// 	console.log("here", req.body);
	// 	const twiml = new MessagingResponse();
	// 	twiml.message('Thanks for the Feedback!');

	// 	res.writeHead(200, { 'Content-Type': 'text/xml' });
	// 	res.end(twiml.toString());
	// }
};
