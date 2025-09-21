const express = require("express")
const Product = require("../models/Products.js");
const { protect, admin } = require("../middleware/authMiddleware.js")

const router = express.Router();

router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,
            material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,
            material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku,
            user: req.user._id//for admin user who created it
        })

        const createdProduct = await product.save();
        res.status(201).json(createdProduct)
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error")
    }
})

router.put("/:id", protect, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections,
            material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured != undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished != undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            //save the updated product
            const updatedProduct=await product.save();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message:"Product not found "})
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")

    }
})

module.exports = router;