const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const route = express.Router();
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use('/v1', route);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
	port: 465,
	host: "smtp.gmail.com",
	auth: {
			user: 'stanjosh@gmail.com',
			pass: process.env.EMAIL_PW,
		},
	secure: true,
});

const validateEmail = (email) => {
	return String(email)
	  .toLowerCase()
	  .match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	  );
};

app.post('/', async (req, res) => {
	if (validateEmail(req.body.email)) {
		let mailData = {
			from: req.body.email,
			to: 'stanjosh@gmail.com',
			subject: `Message from ${req.body.messagesource}`,
			html: `from: ${req.body.email} <b>${req.body.name}</b> 
					<br> <b>${req.body.subject}</b> 
					<br>${req.body.message}<br/>`,
		};
		transporter.sendMail(mailData, function (err, info) {
			if(err) {
				console.log(err)
				return res.status(400).send('message not sent')
			} else {
				console.log(info);
				return res.status(200).send('message sent')
			}
		})
	} else {
		return res.status(400).send('message not sent')
	}
});



app.listen(port, () => {
	    console.log(`Server listening on port ${port}`);
	    });

