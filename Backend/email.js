var nodemailer = require('nodemailer');


var myMail='ua.airlinebs@gmail.com';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myMail,
        pass: 'flightbookproject'
    }
});

function sendEmail(to, name, code){
    var mailOptions = {
        from: myMail,
        to: to,
        subject: 'Бронювання квитків',
        text: 'Шановний(а) '+name+'\nБілети було заброньовано.\nВи можете їх забрати у будь-якому відділенні нашої компанії.\nКод замовлення:'+code
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