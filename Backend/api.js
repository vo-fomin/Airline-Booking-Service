var Flights = require('./data/Flights');
var crypto	=	require('crypto');
var LIQPAY_PUBLIC_KEY='i69608224328';
var LIQPAY_PRIVATE_KEY='aFTFKaoKRdqK0eZZaXqFoT8pmt8HdAxggFs0i6yn';

var email=require('./email');

function base64(str)	 {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

var clientData;

exports.getClientData=function(req, res){
    res.send(clientData);
};

exports.getFlights = function(req, res) {
    res.send(Flights);
};

exports.sendMail=function(req, res){
    email.sendMail(req.body.to, req.body.subject, req.body.message);
};

exports.addTaken=function(req, res){
    var tickets=req.body;
    for(var i=0, j;i<Flights.length;i++){
        if(Flights[i].dest===tickets.dest){
            for(j=0;j<Flights[i].dates.length;j++){
                if(Flights[i].dates[j].date===tickets.date){
                    Flights[i].dates[j].taken=Flights[i].dates[j].taken.concat(tickets.taken);
                    break;
                }
            }
            break;
        }
    }
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    var description=
        "Замовник: "+order_info.name+"\n" +
        "Адреса: "+order_info.address+"\n" +
        "Телефон: "+order_info.phone+"\n" +
        "Замовлення:\n"+order_info.flight +
        "Разом "+order_info.cost+".00грн";
    var order={
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.cost,
        currency:	"UAH",
        description:	description,
        order_id:	Math.random(),
        sandbox:	1
    };
    var data	=	base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    clientData={
        email: order_info.email,
        name: order_info.name,
        code: parseInt(order.order_id*100000000),
        dest: order_info.dest,
        date: order_info.date,
        taken: order_info.taken
    };
    res.send({
        status: true,
        data:data,
        signature:signature
    });
};