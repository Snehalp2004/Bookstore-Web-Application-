import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bookcard from "../BookCard/BookCard";
{/* import { FaRegStar } from "react-icons/fa"; */}

const Favourites = () => {
    const [favouriteBooks, setFavouriteBooks] = useState([]);  // Initialize as empty array
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        const fetchFavouriteBooks = async () => {
            try {
                const response = await axios.get( 
                    `http://localhost:1000/api/v1/get-favourite-books?userId=${localStorage.getItem("id")}`, 
                    { headers }
                );
                setFavouriteBooks(response.data.data);  // Assigning the response data
            } catch (error) {
                console.error("Error fetching favourite books:", error);
            }
        };
        
        fetchFavouriteBooks();
    }, [favouriteBooks]);  // Empty dependency array to avoid infinite loop

    // Function to handle book removal from favorites
    const removeFromFavourites = async (bookId) => {
        try {
            await axios.delete(`http://localhost:1000/api/v1/remove-book-from-favourite/${bookId}`, { headers });
            // Update the state to remove the book from the favorites list instantly
            setFavouriteBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        } catch (error) {
            console.error("Error removing book from favourites:", error);
        }
    };

    return (
        <>
            {favouriteBooks.length === 0 ? (
                
                <div className='text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center flex-col w-full'>
                    No Favourite Book!!!
                  <img src= "./star.png " alt="star" className='h-[20vh] my-8' />
                </div>
            ) : (
                <div className='grid grid-cols-4 gap-4'>
                
                    {favouriteBooks.map((item, i) => (
                        <div key={i}>
                            <Bookcard 
                                data={item} 
                                favourite={true} 
                                onRemove={() => removeFromFavourites(item._id)}  // Pass the remove function to Bookcard
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Favourites;