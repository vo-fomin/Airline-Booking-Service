var defaultFlights = require('./data/Flights');
var crypto	=	require('crypto');
var LIQPAY_PUBLIC_KEY='i69608224328';
var LIQPAY_PRIVATE_KEY='aFTFKaoKRdqK0eZZaXqFoT8pmt8HdAxggFs0i6yn';

var email=require('./email');

var mongoose=require('mongoose');
var Flights=mongoose.model("Flight");
var Complaints=mongoose.model("Complaint");
var CallOrders=mongoose.model("Call");

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
    Flights.count(function(err, count){
        if(!err && count===0){
            for(var i=0;i<defaultFlights.length;i++){
                new Flights({
                    dest: defaultFlights[i].dest,
                    dates: defaultFlights[i].dates
                }).save(function(err, flights_db){
                    if(!err){
                        console.log(flights_db._id);
                    }
                    else console.log(err);
                })
            }
        }
    });
    var flights=[], dates=[];
    var obj;
    Flights.find(function(err, flight_ar){
        if(err)console.log(err);
        for(var i=0, j;i<flight_ar.length;i++) {
            dates=[];
            for(j=0;j<flight_ar[i]._doc.dates.length;j++){
                dates=dates.concat(flight_ar[i]._doc.dates[j]._doc);
            }
            obj = {
                dest:flight_ar[i]._doc.dest,
                dates:dates
            };
            flights = flights.concat(obj);
        }
        console.log(flights);
        res.send(flights);
    });
};

exports.sendMail=function(req, res){
    email.sendMail(req.body.to, req.body.subject, req.body.message);
};

exports.addTaken=function(req, res){
    var tickets=req.body;
    var dates=[];
    Flights.find({
        dest:tickets.dest
        },
        function(err, flight_ar){
            for(var j=0;j<flight_ar[0]._doc.dates.length;j++){
                if(flight_ar[0]._doc.dates[j]._doc.date===tickets.date) {
                    flight_ar[0]._doc.dates[j]._doc.taken = flight_ar[0]._doc.dates[j]._doc.taken.concat(tickets.taken);
                }
                dates=dates.concat(flight_ar[0]._doc.dates[j]._doc);
            }
            Flights.update({
                dest:tickets.dest
            },{
                dest:tickets.dest,
                dates:dates
            }, function(err, result){});
    });
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
        order_id:	Math.random()*100000000,
        sandbox:	1
    };
    var data	=	base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    clientData={
        email: order_info.email,
        name: order_info.name,
        code: parseInt(order.order_id),
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

exports.createComplaint = function(req, res){
    var complaint=req.body;
    new Complaints({
        name:complaint.name,
        mail:complaint.mail,
        phone:complaint.phone,
        address:complaint.address,
        complaint:complaint.text
    }).save(function(err, complaints_db){
        if(!err){
            console.log(complaints_db._id);
        }
        else console.log(err);
    })
};

exports.createCallOrder = function(req, res){
    var callOrder=req.body;
    new CallOrders({
        name:callOrder.name,
        mail:callOrder.mail,
        phone:callOrder.phone
    }).save(function(err, callOrders_db){
        if(!err){
            console.log(callOrders_db._id);
        }
        else console.log(err);
    })
};