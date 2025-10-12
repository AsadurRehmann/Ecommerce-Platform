const express=require("express");
const User=require("../models/Users.js");
const {protect, admin}=require("../middleware/authMiddleware.js");
const router=express.Router();

//get all users admin only request
//access private

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users=await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
});

//post api/admin/users
//add a new user (admin only)
//private/admin
 router.post("/users",protect,admin,async(req,res)=>{
    const {name,email,password,role}=req.body;
    try {
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user=new User({
            name,
            email,
            password,
            role:role || "customer"
        });
        await user.save();
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
 });

 //put //users/:id
 //update user info (admin only)
 //private
 router.put("/users/:id",protect,admin,async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(user){
            user.name=req.body.name || user.name;
            user.email=req.body.email || user.email;
            user.role=req.body.role || user.role;
        }
        const updatedUser=await user.save();
        res.json({message:"User updated successfully",user:updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});     
    }
 })

module.exports=router;