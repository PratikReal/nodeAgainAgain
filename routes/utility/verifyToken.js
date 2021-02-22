var jwt = require("jsonwebtoken");

exports.isLoggedIn = (req,res,next) => {
   const token = req.header("auth-token");
   if(!token) return res.status(401).json({error:"Access Denied"});
   try{
     const verified = jwt.verify(token,"JWT Token For My Project");
     console.log(verified);
     req.user = verified.user;
     next();
   } catch(err){
      let message;
      if(!req.user) message = "Session Time Out ! User Not Found";
      else message = err;
      console.log(message);
      res.status(500).json({error:message})
   }
}