var mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
},{timestamps:true})

module.exports = mongoose.model("userSchema",userSchema);