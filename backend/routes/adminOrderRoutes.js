const express=require("express");
const Order=require("../models/Order.js");
const {protect,admin}=require("../middleware/authMiddleware.js");
const router=express.Router();

//get all the orders
//admin only
router.get("/",protect,admin,async(req,res)=>{
    try {
        const orders=await Order.find({}).populate("user","id name email");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//put api/admin/orders/:id
//update order status
router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id);
        if(order){
            order.status=req.body.status||order.status;
            order.isDelivered=req.body.status==="Delivered"?true:order.isDelivered;
            order.isDeliveredAt=req.body.status==="Delivered"?Date.now():order.isDeliveredAt;

            const updatedOrder=await order.save();
            res.json(updatedOrder);
        }else{
            res.status(404).json({message:"Order not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//delete api/admin/orders/:id
//delete an order
router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id);
        await order.deleteOne();
        res.json({message:"Order deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports=router;