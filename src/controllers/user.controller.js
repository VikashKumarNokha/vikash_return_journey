const express = require("express");
const jwt = require('jsonwebtoken');
const {body, validationResult } = require("express-validator");
const ipinfo = require("ipinfo");

const router = express.Router();

const userSchema = require("../models/user.model")

  const genearteTocken = (newuser)=>{
    return jwt.sign({  newuser }, "vikashsecret"  );
   }

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
          return res.status(200).send({ errors: result.array() });
        }
        
        const user = await userSchema.findOne({ email : req.body.email });
        if(user){
         return res.status(200).json( {message : "useralready registered"} )
        }
         const newuser = await userSchema.create(req.body);  
         
         const tocken =  genearteTocken(newuser);
         
         return res.status(200).json({newuser, tocken});
        
     } catch (error) {
        return res.status(400).json("err", error);
     }
})


module.exports = router;

