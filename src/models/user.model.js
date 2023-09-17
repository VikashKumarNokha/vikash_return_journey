const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
        name : { type : String, required : true },
        email : { type:  String, required : true, unique : true},
        mobile : { type : Number, requred : true, unique : true},
        ipAddress : { type : String, requred : true, unique : true},
        password : { type :  String, requred : true},

     },{
        versionkey : false,
        timestamps : true
     })





module.exports = mongoose.model("returnJourney", userSchema);