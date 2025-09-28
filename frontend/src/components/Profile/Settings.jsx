import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const Settings = () => {
  const [Value, setValue] = useState({ address: "" });
  const [ProfileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading during the update

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    id: id || "", // Ensure `id` is not null
    authorization: token ? `Bearer ${token}` : "", // Ensure `token` is not null
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetch();
  }, []);

  // Function to handle address update
  const handleUpdate = async () => {
    setIsLoading(true);
  
    try {
      await axios.put(
        "http://localhost:1000/api/v1/update-address", // Updated route
        { address: Value.address }, // Send address in the body
        { headers } // JWT token should already be in headers
      );
      alert("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address.");
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <>
      {!ProfileData ? (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>

          <div className="flex gap-12">
            <div>
              <label htmlFor="username">Username</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {ProfileData.username}
              </p>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {ProfileData.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
              rows="5"
              placeholder="Address"
              value={Value.address}
              onChange={(e) => setValue({ address: e.target.value })}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400"
              onClick={handleUpdate} // Handle address update on button click
              disabled={isLoading} // Disable button while updating
            >
              {isLoading ? "Updating..." : "Update"} {/* Show loading state */}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
