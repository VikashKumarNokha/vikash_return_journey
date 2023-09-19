const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const connect = require("./configs/db");
const userController = require("./controllers/user.controller")
const productController = require("./controllers/product.controller")

app.get("/", (req,res)=>{
     return res.status(200).send("Hello server");

})

app.use("/", userController);

app.use("/product", productController);


app.listen(5000,  async ()=>{
      try {
         await connect();
         console.log("server running on port 5000");
      } catch (error) {
         console.log("err", error)
      }
}  )