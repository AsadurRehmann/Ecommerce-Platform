const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv");
const connectDB=require("./config/db");

const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();
const PORT=process.env.PORT;
connectDB(); 

app.get("/",(req,res)=>{
    res.send("Holla");
})

app.listen(PORT,()=>{
    console.log(`app is running at http://localhost:${PORT}`);
})
