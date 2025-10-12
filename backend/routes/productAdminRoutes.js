const express=require("express");
const Product=require("../models/Products.js");
const {protect,admin}=require("../middleware/authMiddleware.js");
const router=express.Router();

//get all products
//admin only
router.get("/",protect,admin,async(req,res)=>{
    try {
        const products=await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports=router;