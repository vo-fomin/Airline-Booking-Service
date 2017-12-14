var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CallOrderSchema=new Schema({
    name:String,
    mail:String,
    phone:String
});

module.exports = mongoose.model("Call", CallOrderSchema);