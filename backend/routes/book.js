const router = require("express").Router();
const User = require("../models/user"); // Updated to use "User"
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt= require("jsonwebtoken");
const Book= require("../models/book");
const { authenticateToken } = require('./userAuth'); 
//add book--admnin
router.post("/add-book", authenticateToken, async (req,res)=>{
    try{
        const { id } = req.headers;
        const user =  await User.findById(id);
        if(user.role!=="admin"){
            return res.status(400).json({ message: 'Access Denied' });

        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({message: "Book added successfully"});
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
});

//update book
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        // Check if bookid is present
        if (!bookid) {
            return res.status(400).json({ message: 'Book ID is required' });
        }
        const updatedBook = await Book.findByIdAndUpdate(
            bookid,
            {
                url: req.body.url,
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                desc: req.body.desc,
                language: req.body.language,
            },
            { new: true } // Return the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error); // Log detailed error
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "Book deleted successfully", });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//get all books
router.get("/get-all-books", async(req, res) => {
    try{
        const books = await Book.find().sort({createdAt:-1});
        return res.json({
            status:"Success",
            data: books,
        });
    }catch(error){
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


//get recently added books limit-4
router.get("/get-recent-books", async(req, res) => {
    try{
        const books = await Book.find().sort({createdAt:-1}).limit(4);
        return res.json({
            status:"Success",
            data: books,
        });
    }catch(error){
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//get book by id
router.get("/get-book-by-id/:id", async(req, res) => {
    try{
        const {id} =req.params;
        const book = await Book.findById(id);
        return res.json({
            status:"Success",
            data: book,
        });
    }catch(error){
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
module.exports = router;