const express=require("express");
const Subscriber=require("../models/Subscriber.js");
const router=express.Router();

//handle nesletter subscription
//access punlic

router.post("/subscribe", async(req, res) => {
    const {email}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    try {
        //check if email is already subscribed
        let subscriber=await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message:"Email is already subscribed"});
        }
        //create a new subscriber
        subscriber=new Subscriber({email});
        await subscriber.save();
        res.status(201).json({message:"Subscribed successfully to the newsletter"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});

    }});

module.exports=router;