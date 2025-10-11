const express=require("express");
const Order=require("../models/Order");
const {protect}=require("../middleware/authMiddleware");

const router=express.Router();

//get logged in user orders
//acces private
router.get("/my-orders",protect,async(req,res)=>{
    try {
        if (!req.user) return res.status(401).json({ message: "User not authenticated" });
        const orders=await Order.find({user:req.user._id}).sort({createdAt:-1});
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
})

//get order details by id
//acces private
router.get("/:id",protect,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id).populate("user","name email");
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
})


module.exports=router;