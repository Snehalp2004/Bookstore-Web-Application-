const router = require("express").Router();
const { authenticateToken } = require('./userAuth');
const book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => { 
try {
const {id} =req.headers;
const { order } = req.body;
for (const orderData of order) {
    const newOrder =new Order({user: id, book: orderData._id});
    const orderDataFromDb= await newOrder.save();

    //saving Order in user model
    await User.findByIdAndUpdate(id , {
    $push: { orders: orderDataFromDb._id}, });
    
    //clearing cart
    await User.findByIdAndUpdate(id, {
    $pull: { cart: orderData._id}, });
    }
return res.json({
status: "Success",
message: "Order Placed Successfully", });
} catch (error) {
console.log(error);
return res.status(500).json({ message: 'Internal server error', error: error.message });
}});

//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try{
    const {id}= req.headers;
    const userData= await User.findById(id).populate({
    path: "orders",
    populate: {path: "book"}, 
});
    const ordersData =userData.orders.reverse();
    return res.json({
    status: "Success",
    data: ordersData,
    });
}catch (error) {
    console.log(error);
    return res.status(500).json({message: "An error occurred"});}
    });

//get all order--- admin
// Corrected model reference and handling of empty orders
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find() // Changed to uppercase 'Order'
            .populate("book", "title desc price") // Use a string for fields
            .populate("user") // Populate user if needed
            .sort({ createdAt: -1 });

        // Handle case when no orders exist
        if (!userData.length) {
            return res.json({ status: "Success", message: "No orders found", data: [] });
        }

        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});



router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Extract status from request body

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true }); // Return updated document

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.json({
            status: "Success",
            message: "Status Updated Successfully",
            data: updatedOrder // Return the updated order data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;