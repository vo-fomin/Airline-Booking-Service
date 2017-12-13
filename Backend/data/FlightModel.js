var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var FlightSchema=new Schema({
    dest: String,
    dates: [
        {
            date: String,
            price: Number,
            taken: [Number]
        }
    ]
});

module.exports = mongoose.model("Flight", FlightSchema);