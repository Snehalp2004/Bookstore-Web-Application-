// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth"; // Adjust the import path accordingly

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate for redirecting
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(authActions.logout()); // Dispatch logout action
    dispatch(authActions.changeRole("user")); // Reset role to default
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className='bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-[100%]'>
      <div className='flex items-center flex-col justify-center'>
        <img src={data.avatar} className='h-[12vh]' alt="User Avatar" />
        <p className='mt-3 text-xl text-zinc-100 font-semibold'>
          {data.username}
        </p>
        <p className='mt-1 text-normal text-zinc-300'>{data.email}</p>
        <div className='w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block'></div>
      </div>
      {role === "user" && (
          <div className='w-full flex-col items-center justify-center flex mt-4'>
          <Link 
            to="/profile"
            className='text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all'
          >
            Favourites
          </Link>
          <Link 
            to="/profile/orderHistory"
            className='text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300'
          >
            Order History
          </Link>
          <Link 
            to="/profile/settings"
            className='text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300'
          >
            Settings
          </Link>
        </div>
      )}
     {role === "admin" && (
  <>
    <Link 
      to="/profile"
      className='text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all'
    >
      All Orders
    </Link>
    <Link 
      to="/profile/add-book"
      className='text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300'
    >
      Add Book
    </Link>
  </>
)}

      <button 
        className='bg-zinc-900 w-3/6 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-900 transition-all duration-300'
        onClick={handleLogout} // Handle logout on button click
      >
        Log Out <FaSignOutAlt className='ml-4' />
      </button>
    </div>
  );
};

export default Sidebar;
