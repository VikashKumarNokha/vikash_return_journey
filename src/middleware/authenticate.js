
const jwt = require("jsonwebtoken")

require("dotenv").config()

 const verifyTocken = (token) =>{
         return new Promise (( reject, resolve)=>{
        var decodedResult =  jwt.verify(token, process.env.secrete_key, function(err, decoded) {

              if(err){
              return  reject( err )
              }
             return resolve( decoded) 

            });
         } )
 }
 
//  this middleware is used for  authentication   check
const authenticate = async (req, res, next) =>{

      if(!req.headers.authorization){
         return res.status(400).send({message : "Autentication tocken not found or invalid"});
      }

      if(!req.headers.authorization.startsWith("Bearer")){
          return res.status(400).send({message : "Autentication tocken not found or invalid"})
      }

      const tocken = req.headers.authorization.trim().split(" ")[1];

      let decoded 

       try{

         // decoded = await verifyTocken(tocken);
          decoded =   jwt.verify(tocken, "vikashsecret", function(err, decoded) {
              if(err){
                return false
              }
              return decoded
            });
          req.user =  decoded.newuser

       }catch(err){
          return res.status(400).send({err})
       }    
   
      return next()
}


module.exports =  authenticate ;