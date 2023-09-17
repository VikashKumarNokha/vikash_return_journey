const mongoose = require("mongoose");
 const bcrypt = require("bcrypt");

const userSchema =  new mongoose.Schema({
        name : { type : String, required : true },
        email : { type:  String, required : true, unique : true},
        mobile : { type : String, requred : true, unique : true},
        ipAddress : { type : String, requred : true, unique : true},
        password : { type :  String, requred : true},

     },{
        versionkey : false,
        timestamps : true
     })


     userSchema.pre("save", function(next){
        const hash = bcrypt.hashSync( this.password , 8 );
              this.password = hash ;
              return next();
      }  )
     




module.exports = mongoose.model("returnJourney", userSchema);