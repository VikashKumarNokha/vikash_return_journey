const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config();

const connect = require("./configs/db");
const userController = require("./controllers/user.controller")
const productController = require("./controllers/product.controller")

app.get("/", (req,res)=>{
     return res.status(200).send("Hello server");

})

//  In usrController router  api available for register, register verification, login and login verification 
app.use("/", userController);

// In productController all api available for getting all products , posting new product in database ,  and  updating product 
app.use("/product", productController);

const port=process.env.PORT || 5000

app.listen( port,  async ()=>{
      try {
         await connect();
         console.log("server running on port 5000");
      } catch (error) {
         console.log("err", error)
      }
}  )