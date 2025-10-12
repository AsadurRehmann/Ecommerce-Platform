const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/UserRoutes.js");
const productRoutes = require("./routes/ProductRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const checkoutRoutes = require("./routes/checkoutRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const uploadsRoutes = require("./routes/uploadsRoutes.js");
const subscriberRoutes = require("./routes/subscribeRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const adminProductRoutes = require("./routes/productAdminRoutes.js");
const adminOrderRoutes = require("./routes/adminOrderRoutes.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Holla");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api", subscriberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
