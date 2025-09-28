import React, { useState, useEffect } from 'react';
import axios from "axios";
import Loader from '../Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { GrLanguage } from 'react-icons/gr';
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import {useSelector} from "react-redux";

import { MdDelete } from "react-icons/md";


const ViewBookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [Data, setData] = useState();
    const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
    const role = useSelector((state)=> state.auth.role);
      useEffect(() => {
          const fetch = async () => {
            const response = await axios.get(
                  `http://localhost:1000/api/v1/get-book-by-id/${id}`
              );
              console.log(response);
              setData(response.data.data);
          };
          fetch();
      }, [id]);
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: id,
      };
      
      const handleFavourite = async () => {
        const userId = localStorage.getItem("id");
        const bookId = id; // Ensure 'id' is set correctly from URL params
    
        // Log the IDs to verify they are not null or undefined
        console.log("User ID:", userId);
        console.log("Book ID:", bookId);
    
        if (!userId || !bookId) {
            console.error("User ID or Book ID is missing");
            alert("User ID and Book ID are required.");
            return;
        }
    
        const requestBody = {
            userId,
            bookid: bookId,
        };
    
        const headers = {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    
        try {
            const response = await axios.put(
                "http://localhost:1000/api/v1/add-book-to-favourite",
                requestBody,
                { headers }
            );
    
            // Check for the specific message indicating the book is already a favorite
            if (response.data.message === "Book is already in favourites") {
                alert("This book is already in your favourites!");
            } else {
                alert("Book added to favourites successfully!");
            }
    
            console.log("Success:", response);
        } catch (error) {
            console.error("Error adding to favourites:", error.response?.data || error.message);
            alert("Failed to add the book to favourites. Please try again.");
        }
    };
    const handleCart = async () => {
        const userId = localStorage.getItem("id"); // Get user ID from local storage
        const bookId = id; // Ensure 'id' is correctly retrieved (likely from URL params or component state)
    
        // Log the IDs to verify they are not null or undefined
        console.log("User ID:", userId);
        console.log("Book ID:", bookId);
    
        if (!userId || !bookId) {
            alert("User ID and Book ID are required.");
            return;
        }
    
        // Prepare the headers with bookid and authorization
        const headers = {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            bookid: bookId, // Send bookid in headers
        };
    
        try {
            const response = await axios.put(
                "http://localhost:1000/api/v1/add-to-cart",
                { userId }, // Only send userId in the body
                { headers } // Include the headers with bookid and authorization token
            )
    
            // Check for response messages and handle them
            if (response.data.message === "Book is already in cart") {
                alert("This book is already in your cart!");
            } else {
                alert("Book added to cart successfully!");
            }
    
            console.log("Success:", response);
        } catch (error) {
            alert("Failed to add book to cart. Please try again.");
            console.error("Error adding to cart:", error.response?.data || error.message);
        }
    };
  const deleteBook = async () => {
    const response = await axios.delete("http://localhost:1000/api/v1/delete-book",
         {headers}
        );
alert(response.data.message);
navigate("/all-books");
  }  
  return (
    <>
    {Data && (
        <div className='px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8 itms-start'>
        <div className=' w-full lg:w-3/6 '>
        {" "}
        <div className='flex flex-col lg:flex-row justify-around bg-zinc-800 p-12 rounded'>
         {" "}   
        <img src ={Data.url} alt="/" className='h-[50vh] md:h-[60vh] lg:h-[70vh] rounded '/>

        {isLoggedIn === true &&role==="user" &&(
            <div className='flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0'>
            <button className='bg-white rounded lg:rounded-full text-3xl p-3 text-red-500 flex items-center justify-center' 
            onClick={handleFavourite}>
                <FaHeart /> <span className='ms-4 block lg:hidden'>Favourites</span>
                </button>
            <button className='text-white rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 bg-blue-500 flex items-center justify-center'
            onClick={handleCart}>
               <FaShoppingCart /> <span className='ms-4 block lg:hidden'>Add to cart</span>
                </button>
            </div>
        )}

        {isLoggedIn === true && role === "admin" && (
        <div className='flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0'>
            
            <button className='text-red-500 rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 bg-white flex items-center justify-center'
            onClick = {deleteBook}>
            <MdDelete /> <span className='ms-4 block lg:hidden'>Delete Book</span>
            </button>
        </div>
        )}


        </div>
        </div>
        <div className='p-4 w-full lg:w-3/6'>
        <h1 className='text-4xl text-zinc-300 font-semibold'>
            {Data.title}
        </h1>
        <p className='text-zinc-400 mt-1'>By {Data.author}</p>
        <p className='text-zinc-500 mt-4 text-xl'>{Data.desc}</p>
        <p className='flex mt-4 items-center justify-start text-zinc-400'>
            <GrLanguage className="me-3"/>{Data.language}
        </p>
        <p className='mt-4 text-zinc-100 text-3xl font-semibold'>
            Price: ₹ {Data.price}{" "}
        </p>
        </div>
    </div>
    )}
    {!Data && (<div className='h-full bg-zinc-900 flex items-center justify-center '> <Loader /> 
    </div>
    )
    }
    
    </>
  )
};

export default ViewBookDetails;