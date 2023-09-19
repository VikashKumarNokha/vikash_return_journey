
const router = require("express").Router();

const productSchema = require("../models/product.models")

const authenticate = require("../middleware/authenticate")

const authorise = require("../middleware/authorise")


router.post("/", authenticate, authorise(["admin"]),  async (req, res)=>{
         
    try{
      const newproduct = await productSchema.create({...req.body, user_id : req.user._id });
       
      return res.status(200).send(newproduct);

    }catch(err){
        return res.status(400).send(err);
    }
}) 


router.patch("/:id", authenticate, authorise(["admin"]),  async (req, res)=>{
         
 try{
     
    const  updated = await  productSchema.findByIdAndUpdate(req.params.id, req.body, {new: true})
 
   return res.status(200).send(updated);

 }catch(err){
     return res.status(400).send(err);
 }
}) 



router.get("/", authenticate,  async (req, res)=>{

    const page = req.query.page ; 
    const perpageitem = req.query.perpageitem || 2 ;

     const skip = (page -1)* perpageitem ;
  
   try{
     const products = await productSchema.find().skip(skip).limit(perpageitem);
     
      const Totalpages =  Math.ceil( (await productSchema.find().countDocuments()) / perpageitem )
      
     return res.status(200).send({ products, Totalpages });

   }catch(err){
       return res.status(400).send(err);
   }
}) 



module.exports = router ;