const express = require("express");
const jwt = require('jsonwebtoken');
const {body, validationResult } = require("express-validator");
const ipinfo = require("ipinfo");

const accountSid = 'AC53f3d4daacebe1a37fb00fc45c293090';
const authToken = 'c3a305acec52abb04c07e7996a89c4d1';

const client = require('twilio')(accountSid, authToken);


const router = express.Router();

const userSchema = require("../models/user.model")

  const genearteTocken = (newuser)=>{
    return jwt.sign({  newuser }, "vikashsecret"  );
   };

   let OTP ;
   let new_user;

router.post("/register",
   
        body("name").trim().not().isEmpty().custom((val)=>{
            if(val.length < 5){
            throw new Error("name should be more than three charecterr");
            }
            return true;
        }),
        body("email").isEmail().custom( async (value)=>{
            // const mail = await users.findOne({email : value});
            // if(mail){
            //     throw new Error("emaill already exist");
            // }
            // console.log("emailll", mail)
            return true;
        }),
        body("mobile").trim().not().isEmpty().custom( async (value)=>{
            if(value.length > 10 || value.length <10){
                throw new Error("mobile number need only ten digit");
            }
            // const mobil = await users.findOne({mobile : value});
            // if(mobil){
            //     throw new Error("mobile already exist");
            // }
            return true;
        }),
        body("ipAddress").trim().not().isEmpty().custom( async (ipAddress)=>{
            ipinfo(ipAddress, (err, cLoc) => {
                if (err) {
                  console.error("Error:", err);
                  throw new Error("Invalide ipAddress"); 
                } else {
                  console.log("IP Address:", cLoc.ip);
                  console.log("City:", cLoc.city);
                  console.log("Region:", cLoc.region);
                  console.log("Country:", cLoc.country);
                  console.log("Location:", cLoc.loc);
                }
              });
            return true;
        }),
        body("password").not().isEmpty().withMessage("empty pass not allowed").custom((val)=>{
        var passw= /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
        if(!val.match(passw)) {
            throw new Error("password must be strong");
        }
        return true;
        }),  

    async (req, res)=>{
      
     try {  
        const result = validationResult(req);
        if (!result.isEmpty()) {
          return res.status(400).send({ errors: result.array() });
        }
        
        const user = await userSchema.findOne({ email : req.body.email });
        if(user){
         return res.status(400).json( {message : "useralready registered"} )
        }

         new_user = new userSchema(req.body) ;

         let digits = "0123456789";
         OTP = "";
         for(let i=0; i<4; i++){
           OTP  += digits[Math.floor(Math.random() * 10)];
         }
         
        client.messages
        .create({
          body: `Your OTP verification for user ${req.body.name} is ${OTP} `,
          to:  "+91"+ req.body.mobile, // Text your number
          from: '+12562864577', // From a valid Twilio number
        })
        .then((message) => res.status(200).json({"massege" : "OTP send to your mobile number"}));
        
     } catch (error) {
        return res.status(500).json({"err": error?.message});
     }
})


router.post("/register/verify", async (req, res)=>{
      try {
         const {otp } = req.body;
         if(otp != OTP){
            return res.status(400).json({"message" : "Incorrect otp"});
         }

          new_user = await new_user.save();
          const tocken =  genearteTocken(new_user);
           OTP ="";
          return res.status(200).json({new_user, tocken});
        
      } catch (error) {
         return res.status(500).json({"err" : error?.message})
      }
});

 let signInuser;
router.post("/login", async (req, res)=>{
     try {
       const  {mobile} = req.body ;
       signInuser = await userSchema.findOne({mobile : mobile});
        if(!signInuser){
           return res.status(400).json({"msg" :"This number does not exists!" });
        }

        let digits = "0123456789";
        OTP = "";
        for(let i=0; i<4; i++){
          OTP  += digits[Math.floor(Math.random() * 10)];
        }
        
       client.messages
       .create({
         body: `Hi ${signInuser?.name},  Your OTP verification for Login  is ${OTP} `,
         to:  "+91"+ mobile, // Text your number
         from: '+12562864577', // From a valid Twilio number
       })
       .then((message) => res.status(200).json({"massege" : "OTP send to your mobile number"}));

     } catch (error) {
          return res.status(500).json({"msg" : error.message});
     }
})


router.post("/login/verify", async (req, res)=>{
  try {
     const {otp } = req.body;
     if(otp != OTP){
        return res.status(400).json({"message" : "Incorrect otp"});
     }

      
      const tocken =  genearteTocken(signInuser);
       OTP ="";
      return res.status(200).json({signInuser, tocken});
    
  } catch (error) {
     return res.status(500).json({"err" : error?.message})
  }
});




module.exports = router;

