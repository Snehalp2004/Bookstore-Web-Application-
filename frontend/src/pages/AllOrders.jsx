import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader"; // Adjust the path as necessary

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user's details
  const [showUserModal, setShowUserModal] = useState(false); // To manage modal visibility

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-orders", { headers });
        setOrders(response.data.data); // Fetch and set orders data
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v1/update-status/${orderId}`,
        { status: newStatus },
        { headers }
      );
      // Update local state with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const fetchUserDetails = async (userId) => { // Accept userId parameter
    try {
      const response = await axios.get(`http://localhost:1000/api/v1/get-user-order-information/${userId}`, { headers });
      setSelectedUser(response.data); // Set the selected user's details
      setShowUserModal(true); // Show the modal
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closeModal = () => {
    setShowUserModal(false); // Close the modal
    setSelectedUser(null); // Reset the selected user
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-screen p-4 text-zinc-100 bg-black">
      <h1 className="text-3xl font-semibold text-zinc-500 mb-8">All Orders Management</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <h2 className="text-5xl font-semibold text-zinc-500">No Orders Available</h2>
          <img src="./no-history.png" alt="No Orders" />
        </div>
      ) : (
        <div className="bg-zinc-800 w-full rounded py-2 px-4 overflow-auto h-[70vh]">
          <div className="mt-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1>Books</h1>
            </div>
            <div className="w-[9%]">
              <h1>Price</h1>
            </div>
            <div className="w-[16%]">
              <h1>Status</h1>
            </div>
            <div className="w-[12%]">
              <h1>User Details</h1>
            </div>
          </div>
          {orders.map((order, index) => (
            <div key={order._id} className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900">
              <div className="w-[3%]">
                <h1 className="text-center">{index + 1}</h1>
              </div>

              {/* Book Information */}
              <div className="w-[22%]">
                <h1 className="text-lg font-semibold text-zinc-400">{order.book?.title || "Book title unavailable"}</h1>
              </div>

              {/* Book Price */}
              <div className="w-[9%]">
                <h1 className="text-lg text-zinc-300">{order.book?.price ? `₹${order.book.price}` : "Price unavailable"}</h1>
              </div>

              {/* Order Status */}
              <div className="w-[16%] flex items-center">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="p-2 rounded bg-gray-800 text-white"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* User Details Button */}
              <div className="w-[12%] flex items-center">
                <button
                  onClick={() => fetchUserDetails(order.user)} // Pass user ID correctly
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
