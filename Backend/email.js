var nodemailer = require('nodemailer');


var myMail='ua.airlinebs@gmail.com';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myMail,
        pass: 'flightbookproject'
    }
});

function sendEmail(to, subject, message){
    var mailOptions = {
        from: myMail,
        to: to,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendMail=sendEmail;