var mongoose = require("mongoose");

var messagesSchema = mongoose.Schema({
    taskTitle:String,
    date:String,
    taskDiscription:String,
    username:String,
    time:{type:Date, default: Date.now}
})


module.exports = mongoose.model("message",messagesSchema);