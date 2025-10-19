const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
// const Product = require("../models/Products");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
//working
router.put("/:id", protect, async (req, res) => {
    const { paymentStatus,paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: "invalid payment status" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }
})
//working
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no items in checkout." })
    }

    try {
        // Create an Order directly
        const newOrder = await Order.create({
            user: req.user._id,
            orderItems: checkoutItems.map(item => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity
            })),
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone
            },
            paymentMethod: paymentMethod,
            totalPrice: totalPrice,
            isPaid: false,
            paymentStatus: "pending",
            status: "Processing"
        });

        // Clear the user's cart after successful order
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
                products: [],
                totalPrice: 0
            },
            { new: true }
        );

        console.log(`Order created: ${newOrder._id}`);
        res.status(201).json(newOrder);

    } catch (error) {
        console.error("Error creating order", error)
        res.status(500).json({ message: "server error" });
    }
})
//working
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email"); // Change to Order
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//working
router.get("/myorders", protect, async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user._id }); // Change to Order
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//working
router.put("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id); // Change to Order
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "Delivered") order.isDelivered = true;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;