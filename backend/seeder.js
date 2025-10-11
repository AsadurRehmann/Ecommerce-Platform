const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Products");
const User = require("./models/Users");
const Cart = require("./models/Cart");
const Order=require("./models/Order");
const products = require("./data/products");
const orders=require("./data/orders")

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// func to seed data
const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        await Order.deleteMany();

        console.log("Existing data deleted succesfully.")

        // default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin"
        });

        // assign the default userid ot each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID }
        });

        // insert products.js in DB
        await Product.insertMany(sampleProducts);
        await Order.insertMany(orders);
        console.log("Products seeded successfully");
        process.exit();

    } catch (err) {
        console.error("Error in seeding data:", err);
        process.exit(1);
    }
}

seedData();