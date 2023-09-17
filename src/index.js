const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
     return res.status(200).send("Hello server");

})


app.listen(5000,  async ()=>{
      try {
         console.log("server running on port 5000");
      } catch (error) {
         console.log("err", error)
      }
}  )