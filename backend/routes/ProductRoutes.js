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
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found " })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")

    }
})

router.delete("/:id", protect, admin, async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne();
            res.json({ message: "product deleted." })
        } else {
            res.status(404).json({ message: "product not found" })
        }
    } catch (err) {
        console.error("ERROR OCCURED IN DELETING:", err);
        res.status(500).json({ message: "Server error." })

    }
})

// get all products with optional filters
router.get("/", async (req, res) => {
    try {
        const { collection, size, color, gender, material,
            minPrice, maxPrice, sortBy, search, category, brand, limit } = req.query;

        let query = {};

        if (collection && collection.toLocaleLowerCase() != "all") {
            query.collections = collection;
        }

        if (category && category.toLocaleLowerCase() != "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") }
        }

        if (brand) {
            query.brand = { $in: brand.split(",") }
        }

        if (size) {
            query.sizes = { $in: size.split(",") }
        }

        if (color) {
            query.colors = { $in: [color] }
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // for search query bar
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },

            ]
        }

        let sort = {};
        //sort filter
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 }
                    break;
                default:
                    break;
            }
        }

        // fetch products and apply sorting and limit
        let products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);
        res.json(products)
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error")

    }
});

router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 })

        if (bestSeller) {
            res.json(bestSeller)
        } else {
            res.status(404).json({ message: "No best seller found" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error")
    }
})

router.get("/new-arrivals", async (req, res) => {
    try {
        let newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        if (newArrivals) {
            res.json(newArrivals)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("server error")
    }
})

router.get("/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (product) {
            res.json(product)
        } else {
            console.error(err);
            res.status(500).send("server error")

        }
    } catch (err) {

    }
})

router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },    //exclude the current product
            gender: product.gender,
            category: product.category
        }).limit(4);

        res.json(similarProducts)
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error")

    }
})


module.exports = router;