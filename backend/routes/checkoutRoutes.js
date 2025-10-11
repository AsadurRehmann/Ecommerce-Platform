const express = require("express");
const Checkout = require("../models/Checkout");
// const Cart = require("../models/Cart");
// const Product = require("../models/Products");
// const Order = require("../models/Order");
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
        //create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });
        console.log(`Checkout created for user:${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating new session",error)
        res.status(500).json({ message: "server error" });
    }
})
//working
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Checkout.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//working
router.get("/myorders", protect, async (req, res) => {
  try {
    const myOrders = await Checkout.find({ user: req.user._id });
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//working
router.put("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Checkout.findById(req.params.id);
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