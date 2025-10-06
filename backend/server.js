const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes.js");
const productRoutes=require("./routes/ProductRoutes.js");
const cartRoutes=require("./routes/cartRoutes.js")
const checkoutRoutes=require("./routes/checkoutRoutes.js")

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const PORT = process.env.APP_PORT;
connectDB();

app.get("/", (req, res) => {
    res.send("Holla");
})

app.use("/api/users", userRoutes)
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoutes);

app.listen(PORT, () => {
    console.log(`app is running at http://localhost:${PORT}`);
})
