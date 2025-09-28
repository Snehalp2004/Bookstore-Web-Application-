const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require('./userAuth'); 
//put book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers; // Extract bookid from headers
        const userId = req.body.userId; 
        if (!bookid) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isBookInCart = userData.cart.includes(bookid);

        if (isBookInCart) {
            return res.json({
                status: "Success",
                message: "Book is already in cart",
            });
        }

        await User.findByIdAndUpdate(userId, {
            $push: { cart: bookid },
        });

        return res.json({
            status: "Success",
            message: "Book added to cart",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Remove book from cart
router.put("/remove-book-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
      const { bookid } = req.params; // Extract bookid from params
      const userId = req.user.id;     // Extract userId from the authenticated user (from token)
  
      if (!bookid || !userId) {
        return res.status(400).json({ message: 'Book ID and User ID are required' });
      }
  
      // Find and update the user's cart
      await User.findByIdAndUpdate(userId, {
        $pull: { cart: bookid }, // Remove the book from the user's cart
      });
  
      return res.json({
        status: "Success",
        message: "Book removed from cart",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error occurred" });
    }
  });
  
/// Get cart  of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
        

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
 
        const cart = userData.cart.reverse();
        
        return res.json({
            status: "Success",
            data: cart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured"});
    }
});
module.exports = router;