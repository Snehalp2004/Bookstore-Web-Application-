import React, { useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  // Function to handle input changes
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  // Function to handle form submission
  const submit = async (e) => {
    e.preventDefault(); // Prevent form from reloading page

    // Input validation
    if (
      Data.url === "" ||
      Data.title === "" ||
      Data.author === "" ||
      Data.price === "" ||
      Data.desc === "" ||
      Data.language === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Making the API call to add the book
      const response = await axios.post(
        "http://localhost:1000/api/v1/add-book", // Replace with your actual API endpoint
        {
          url: Data.url,
          title: Data.title,
          author: Data.author,
          price: Data.price,
          desc: Data.desc,
          language: Data.language,
        },
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to add book.");
    }
  };

  return (
    <div className="h-screen bg-black text-white">
      <h2 className="text-2xl font-semibold mb-8 pl-4 bg-zinc-900 p-2 rounded">Add a New Book</h2>
      <form
        onSubmit={submit}
        className="w-full bg-zinc-900 p-6 rounded-lg shadow-lg" // Full width
      >
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Image URL</label>
          <input
            type="text"
            name="url"
            value={Data.url}
            onChange={change}
            placeholder="Enter image URL"
            className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={Data.title}
            onChange={change}
            placeholder="Enter book title"
            className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="w-1/2 mr-2">
            <label className="block text-lg font-semibold mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={Data.author}
              onChange={change}
              placeholder="Enter author's name"
              className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-lg font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={Data.price}
              onChange={change}
              placeholder="Enter price"
              className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Description</label>
          <textarea
            name="desc"
            value={Data.desc}
            onChange={change}
            placeholder="Enter book description"
            className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="block text-lg font-semibold mb-2">Language</label>
          <input
            type="text"
            name="language"
            value={Data.language}
            onChange={change}
            placeholder="Enter book language"
            className="w-full p-4 text-lg font-semibold border border-gray-400 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-4 bg-black text-white text-lg font-semibold rounded hover:bg-gray-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
