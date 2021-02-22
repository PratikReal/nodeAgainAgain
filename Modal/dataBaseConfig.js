var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/userInformationAgainAgain",{useNewUrlParser:true,useUnifiedTopology:true})
         .then(()=>console.log(" Database Is Connected"))
         .catch((err)=>console.log("DataBase Is Not Connected",err))