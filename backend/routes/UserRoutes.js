const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const router = express.Router();
const {protect}=require("../middleware/authMiddleware.js")

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "user already exists" })

        user = new User({ name, email, password });
        await user.save();

        //    jwt payload
        const payload = { user: { id: user._id, role: user.role } };

        // sign and return the user along with the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                // send the user and token with response
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }, token
                })
            }
        )
    } catch (err) {
        console.log("ERROR", err);
         res.status(500).send("Server error");
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user =await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const isMatch=await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

         //    jwt payload
        const payload = { user: { id: user._id, role: user.role } };

        // sign and return the user along with the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                // send the user and token with response
                res.status(200).json({
                    user: {
                         name: user.name,
                        email: user.email,
                        role: user.role
                    }, token
                })
            }
        )

    } catch (err) {
        console.error(err);
        res.status(500).send("dayum")

    }
})

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});


module.exports = router;