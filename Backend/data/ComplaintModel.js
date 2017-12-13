var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ComplaintSchema=new Schema({
    name:String,
    mail:String,
    phone:String,
    address:String,
    complaint:String
});

module.exports = mongoose.model("Complaint", ComplaintSchema);