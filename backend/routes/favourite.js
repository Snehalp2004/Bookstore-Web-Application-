const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require('./userAuth'); 

// add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, userId } = req.body; // Expecting bookid and userId in the request body

        if (!bookid || !userId) {
            return res.status(400).json({ message: 'Book ID and User ID are required' });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isBookFavourite = userData.favourites.includes(bookid);

        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourites" });
        }

        await User.findByIdAndUpdate(userId, { $push: { favourites: bookid } });

        return res.status(200).json({ message: "Book added to favourites" });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//delete from fav
router.delete("/remove-book-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, userId } = req.body; // Expecting bookid and userId in the request body
        
        if (!bookid || !userId) {
            return res.status(400).json({ message: 'Book ID and User ID are required' });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isBookFavourite = userData.favourites.includes(bookid);
        if (!isBookFavourite) {
            return res.status(200).json({ message: "Book is not in favourites" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { favourites: bookid } });
        return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
        console.error('Error in remove-book-from-favourite:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


/// Get favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from the request body

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch user data and populate favourite books
        const userData = await User.findById(userId).populate('favourites');

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favouriteBooks = userData.favourites;

        return res.json({
            status: "Success",
            data: favouriteBooks,
        });
    } catch (error) {
        console.error('Error in get-favourite-books:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;


