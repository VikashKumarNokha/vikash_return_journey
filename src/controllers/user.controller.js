const express = require("express");
      require("dotenv").config();
const jwt = require('jsonwebtoken');
const {body, validationResult } = require("express-validator");
const ipinfo = require("ipinfo");
const bcrypt = require("bcrypt");
      // KZJZ356NKLN7BKN9TJDZDM2J
const accountSid = process.env.ACCOUNTSID_VIKASH;
const authToken = process.env.AUTHTOKEN_VIKASH ;

const client = require('twilio')(accountSid, authToken);


const router = express.Router();

const userSchema = require("../models/user.model")

//   this functionis used for genarating a token
  const genearteTocken = (newuser)=>{
    return jwt.sign({  newuser }, "vikashsecret"  );
   };

   let OTP ;
   let new_user;
   let city, region, country;

  //   this route is used for registration 
router.post("/register",
   
        body("name").trim().not().isEmpty().custom((val)=>{
            if(val.length < 5){
            throw new Error("name should be more than three charecterr");
            }
            return true;
        }),
        body("email").isEmail().custom( async (val)=>{
            // const mail = await users.findOne({email : val});
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
                  console.error("Errorrrr:", err);
                  throw new Error("Invalide ipAddress"); 
                } else {
                   if(!cLoc.ip){
                    throw new Error("Invalide ipAddress"); 
                   }
                   city = cLoc.city;
                   region = cLoc.region ;
                   country = cLoc.country ;
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

        const userMobile = await userSchema.findOne({ mobile : req.body.mobile });
        if(userMobile){
         return res.status(400).json( {message : "useralready registered"} )
        }  

        const userIpAddress = await userSchema.findOne({ ipAddress : req.body.ipAddress });
        if(userIpAddress){
         return res.status(400).json( {message : "useralready registered"} )
        }  

         new_user = req.body ;

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
        .then((message) =>{
          OTP = bcrypt.hashSync( OTP , 8 );
          console.log("ooo", OTP); 
       return  res.status(200).json({"massege" : "OTP send to your mobile number"}) } );
        
     } catch (error) {
        return res.status(500).json({"err": error?.message});
     }
})

//   this route is used for registration verification
router.post("/register/verify", async (req, res)=>{
      try {
         const {otp } = req.body;
           
         if(!bcrypt.compareSync( otp, OTP) ){
            return res.status(400).json({"message" : "Incorrect otp"});
         }

          new_user = await userSchema.create({...new_user, city, region, country });
          const tocken =  genearteTocken(new_user);
           OTP ="";
          return res.status(200).json({new_user, tocken});
        
      } catch (error) {
         return res.status(500).json({"err" : error?.message})
      }
});

 let signInuser;

//  this route is used for login
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
       .then((message) =>{ 
        OTP = bcrypt.hashSync( OTP , 8 );
        return  res.status(200).json({"massege" : "OTP send to your mobile number"})
       });

     } catch (error) {
          return res.status(500).json({"msg" : error.message});
     }
})

//  this route is used for login verification
router.post("/login/verify", async (req, res)=>{
  try {
     const {otp } = req.body;
     if(!bcrypt.compareSync( otp, OTP)){
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

