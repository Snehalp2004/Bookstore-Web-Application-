import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Admin Profile",
      link: "/profile",
    },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Removing Cart and Profile links if not logged in
  if (!isLoggedIn) {
    links.splice(2, 3);
  }
  if (isLoggedIn === true && role === "user") {
    links.splice(4, 1);
  }
  if (isLoggedIn === true && role === "admin") {
    links.splice(2, 2);
  }

  const [MobileNav, setMobileNav] = useState("hidden");

  const toggleMobileNav = () => {
    setMobileNav((prev) => (prev === "hidden" ? "block" : "hidden"));
  };

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="h-16 me-4" src="/logo.png" alt="logo" />
          <h1 className="text-2xl font-semibold">The Velvet Spine</h1>
        </Link>

        <div className="nav-links-The Velvet Spine block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((items, i) => (
              <div className="flex items-center" key={i}>
                {items.title === "Profile" || items.title === "Admin Profile" ? (
                  <Link
                    to={items.link}
                    className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                  >
                    {items.title}
                  </Link>
                ) : (
                  <Link
                    to={items.link}
                    className="hover:text-blue-500 transition-all duration-300"
                  >
                    {items.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                LogIn
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-blue-400 text-zinc-800 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                SignUp
              </Link>
            </div>
          )}

          <button
            className="block md:hidden text-white text-2xl hover:text-zinc-400"
            onClick={toggleMobileNav}
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      <div
        className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((items, i) => (
          <Link
            to={items.link}
            className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
            key={i}
            onClick={toggleMobileNav}
          >
            {items.title}
          </Link>
        ))}

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="px-8 py-2 mb-8 text-3xl font-semibold border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={toggleMobileNav}
            >
              LogIn
            </Link>
            <Link
              to="/signup"
              className="px-8 py-2 mb-8 text-3xl font-semibold bg-blue-500 text-zinc-800 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={toggleMobileNav}
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
