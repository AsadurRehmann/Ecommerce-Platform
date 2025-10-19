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
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
            await cart.save();
            return res.status(200).json(cart)
        } else {
            // create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity
            })
            res.status(201).json(newCart)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" })
    }
});

router.put("/", async (req, res) => {
    const { productId, guestId, userId, quantity, size, color } = req.body;

    try {
        let cart = await getCart(userId, guestId);

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            //update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1) //remove product if quantity is zero
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not found in cart" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." })

    }
})

router.delete("/", async (req, res) => {

    const { productId, guestId, userId, size, color } = req.body;

    try {

        let cart = await getCart(userId, guestId);

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity, 0);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart." })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." })

    }
})

router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        let cart = await getCart(userId, guestId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart not found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" })

    }
})

//merge route to merge cart of guest with user on login
router.post("/merge", protect, async (req, res) => {

    const { guestId } = req.body;
    try {

        //find the guest and user cart
        const guestCart = await Cart.findOne({ guestId })
        const userCart = await Cart.findOne({ user: req.user._id })

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "guest cart is empty." })
            }

            if (userCart) {
                //mergeb guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    )

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity, 0
                );
                await userCart.save();
                //remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.error("error deleting the guest cart:", error);
                }
                return res.status(200).json(userCart)
            } else {
                //if the user has no existing cart assign the cart
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart)
            }
        } else {
            if (userCart) {
                //if guest cart has been already merged return the user cart
                return res.status(200).json(userCart)
            }
            res.status(404).json({ messgae: "guest cart not found." })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" })


    }
})

module.exports = router;