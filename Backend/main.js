var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/Flights', {useMongoClient:true});
var db=mongoose.connection;

db.on('error', function(err){
    console.log('connection error:', err.message);
});
db.once('open', function callback(){
    console.log('Connected to DB!');
});
mongoose.Promise=global.Promise;

var Flight=require('./data/FlightModel');
var Complaint=require('./data/ComplaintModel');
var CallOrder=require('./data/CallOrderModel');

function configureEndpoints(app) {
    var pages = require('./pages');
    var api = require('./api');

    app.get('/api/get-flights/', api.getFlights);
    app.get('/api/get-client-data/', api.getClientData);
    app.post('/api/create-order/', api.createOrder);
    app.post('/api/send-mail/', api.sendMail);
    app.post('/api/send-tickets/', api.addTaken);
    app.post('/api/send-complaint/', api.createComplaint);
    app.post('/api/send-call-order/', api.createCallOrder);

    app.get('/', pages.mainPage);

    app.use(express.static(path.join(__dirname, '../Frontend/assets')));
}

function startServer(port) {
    var app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    configureEndpoints(app);

    app.listen(port, function () {
        console.log('My Application Running on http://localhost:'+port+'/');
    });
}

exports.startServer = startServer;