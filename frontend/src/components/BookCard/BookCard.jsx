import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookCard = ({ data, favourite }) => {
  const handleRemoveBook = async () => {
    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const userId = localStorage.getItem("id");

    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v1/remove-book-from-favourite`, // Ensure the API endpoint is correct
        {
          headers,
          data: {
            bookid: data._id,
            userId, // Send book ID in the request body
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      alert("Failed to remove book from favourites.");
    }
  };

  return (
    <div className='bg-zinc-800 rounded p-4 flex flex-col'>
      <Link to={`/view-book-details/${data._id}`}>
        <div className='bg-zinc-900 rounded flex items-center justify-center'>
          <img src={data.url} alt={data.title} className='h-[25vh]' />
        </div>
        <h2 className='mt-4 text-xl text-white font-semibold'>{data.title}</h2>
        <p className='mt-2 text-zinc-400 font-semibold'>By {data.author}</p>
        <p className='mt-2 text-zinc-200 font-semibold text-xl'>₹{data.price}</p>
      </Link>
      {favourite && (
        <button
          className='bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4'
          onClick={handleRemoveBook}
        >
          Remove from favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
