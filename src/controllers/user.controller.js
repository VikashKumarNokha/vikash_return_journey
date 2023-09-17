const express = require("express");

const router = express.Router();

const userSchema = require("../models/user.model")


router.get("/register", async (req, res)=>{
      
     try {

         return res.status(200).send("register")
        
     } catch (error) {
        return res.status(400).json("err", error);
     }
})


module.exports = router;

