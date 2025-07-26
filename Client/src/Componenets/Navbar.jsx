import React, { useContext, useEffect } from "react";
import { FaWallet, FaBars } from "react-icons/fa";
import { Link, useNavigate, Outlet } from "react-router-dom";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isLoggedIn, logoutUser, fetchWallet, wallet } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchWallet();
    }
  }, [isLoggedIn]);

  return (
    <div className="drawer lg:drawer-open"> {/* ✅ force open on large screens */}
      <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* 👉 Top Navbar */}
        <div className="w-full navbar bg-base-200 px-4 sm:px-20 sticky top-0 z-50 shadow-md justify-between">
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <label htmlFor="sidebar-toggle" className="btn btn-square btn-ghost lg:hidden">
                <FaBars className="text-xl" />
              </label>
            )}
            <Link to="/" className="text-xl font-bold">
              LOGO
            </Link>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2 px-3 py-2 rounded bg-base-300">
              <FaWallet className="text-xl" />
              <span className="font-semibold">₹{wallet?.balance ?? 0}</span>
            </div>
          )}
        </div>

        {/* 👉 Page content goes here */}
        <div className="p-4">
          <Outlet /> {/* This is required for nested routes */}
        </div>
      </div>

   {/* 👉 Sidebar */}
{isLoggedIn && (
  <div className="drawer-side">
    <label htmlFor="sidebar-toggle" className="drawer-overlay"></label>
    <aside className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul className="space-y-1">
        <li>
          <Link
            to="/topup"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-base-300 transition"
          >
            💰 <span>Top-Up Wallet</span>
          </Link>
        </li>
        <li>
          <Link
            to="/topuporders"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-base-300 transition"
          >
            📜 <span>Orders History</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-base-300 transition"
          >
            👤 <span>Profile</span>
          </Link>
        </li>
      </ul>

      <div className="mt-6">
        <button
          onClick={() => {
            logoutUser();
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  </div>
)}
    </div>
  );
};

export default Navbar;
