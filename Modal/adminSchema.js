var mongoose = require("mongoose")

var adminSchema = mongoose.Schema({
    adminname:String,
    email:String,
    password:String,
},{timestamps:true})

module.exports = mongoose.model("adminSchema",adminSchema);