const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Products");
const User = require("./models/Users");
const Cart = require("./models/Cart");
const produsts = require("./data/products");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// func to seed data
const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

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
        console.log("Products seeded successfully")
        process.exit();

    } catch (err) {
        console.error("Error in seeding data:", err);
        process.exit(1);
    }
}

seedData();