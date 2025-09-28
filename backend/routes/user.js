const mongoose = require('mongoose'); // Import mongoose
const router = require("express").Router();
const User = require("../models/user"); 
const bcrypt = require("bcryptjs"); 
const jwt= require("jsonwebtoken");
const Order = require('../models/order');
const { authenticateToken } = require('./userAuth'); 
// Sign Up Route
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Validate input
        if (!username || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }

        // Check if username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds can be adjusted

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Save hashed password
            address,
        });

        await newUser.save();
        return res.status(201).json({ message: "Sign-up successful" });
    } catch (error) {
        console.error("Error during sign-up:", error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});
//sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      // Store id, username, and role directly in the token payload
      const token = jwt.sign(
        { id: existingUser._id, username: existingUser.username, role: existingUser.role },
        "bookStore123",
        { expiresIn: "30d" }
      );
      return res.status(200).json({
        id: existingUser._id,
        role: existingUser.role,
        token: token,
      });
    } else {
      return res.status(400).json({ message: "Invalid Credentials." });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get user information
router.get('/get-user-information', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Use user ID from JWT payload
        const data = await User.findById(userId).select('-password');

        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user information:', error); // Log detailed error
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/get-user-order-information-by-order/:orderId', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate the orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the user by user ID stored in the order
    const userId = order.user;
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user information
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



//update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Use user ID from JWT payload
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findByIdAndUpdate(userId, { address });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
