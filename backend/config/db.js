const mongoose=require("mongoose");


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MOngo connected")
    }catch(err){
        console.log("Mongo failed",err)
        process.exit(1)
    }
}

module.exports=connectDB;
