const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    } else {
        return null;
    }
}

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // if user is logged in or guest
        let cart = await getCart(userId, guestId);

        // if cart exists update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // if product wxist , update it
                cart.products[productIndex].quantity += quantity;
            } else {
                // add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                })
            }

            // recalculate the total price
            cart.totalPrice=cart.products.reduce(
                (acc,item)=> acc + item.price * item.quantity,
                0
            )
            await cart.save();
            return res.status(200).json({cart})
        }else{
            // create a new cart for the guest or user
            const newCart=await Cart.create({
                userId:userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products:[
                    {
                        productId,
                        name:product.name,
                        image:product.images[0].[url]
                    }
                ]
            })
        }
    } catch (error) {

    }
})