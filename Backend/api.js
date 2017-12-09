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


exports.getFlights = function(req, res) {
    res.send(Flights);
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
    email.sendMail(order_info.email, order_info.name, order.order_id);
    res.send({
        status: true,
        data:data,
        signature:signature
    });
};