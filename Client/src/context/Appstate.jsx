import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/config.js";
import {razorpayKey } from "../constants/config.js";

const Appstate = (props) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchWallet();
      checkAdmin();
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // -------- AUTH --------

  const registerUser = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, { email, password }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        setToken(res.data.token);
        setIsLoggedIn(true);
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logoutUser = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  const checkAdmin = () => {
    setIsAdmin(user?.role === "admin" || user?.isAdmin);
  };

  // -------- USER --------

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { Auth: token },
        withCredentials: true,
      });
      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  };

  const updateProfile = async (formData) => {
    if (!token) return;
    try {
      const res = await axios.post(`${BASE_URL}/user/editUser`, formData, {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      });
      if (res.data.user) {
        setUser(res.data.user);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const deleteUser = async (userId) => {
    if (!token) return;
    try {
      const res = await axios.delete(`${BASE_URL}/user/${userId}`, {
        headers: { Auth: token },
        withCredentials: true,
      });
      toast[res.data.success ? "success" : "error"](res.data.message);
    } catch (err) {
      toast.error("Error deleting user", err);
    }
  };

  // -------- WALLET --------

  const fetchWallet = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/wallet/getbalance`, {
        headers: { Auth: token },
        withCredentials: true,
      });
      setWallet(res.data.wallet);
      console.log("Wallet fetched:", res.data.wallet);
    } catch (err) {
      console.error("Error fetching wallet", err);
    }
  };

  const topUpWallet = async (amount) => {
  if (!token) {
    toast.error("Please login first");
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}/payment/topup`, { amount }, {
      headers: { "Content-Type": "application/json", Auth: token },
      withCredentials: true,
    });

    const { orderId } = res.data;

    // ✅ Use your constant Razorpay key here
    const key = razorpayKey;

    const options = {
      key,
      amount: amount * 100,
      currency: "INR",
      name: "Nitesh Kushwaha",
      description: "Wallet Top Up",
      order_id: orderId,
      handler: verifyPayment, // ✅ correct!
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error( err.response.data.message);
    toast.error(` ${err.response.data.message}`);
  }
};


  const verifyPayment = async (paymentResponse) => {
  try {
  
    const res = await axios.post(`${BASE_URL}/payment/verify`, paymentResponse, {
      headers: { Auth: token },
      withCredentials: true,
    });
    if (res.data.success) {
      toast.success("Payment successful, wallet updated!");
      fetchWallet();
    } else {
      toast.error("Payment verification failed.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error verifying payment");
  }
};

// 👉 Fetch all top-up orders for logged-in user
  const fetchUserOrders = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/payment/get-orders`, {
        headers: { Auth: token },
        withCredentials: true,
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        isLoggedIn,
        isAdmin,
        user,
        wallet,
        registerUser,
        loginUser,
        logoutUser,
        fetchUserProfile,
        updateProfile,
        deleteUser,
        fetchWallet,
        topUpWallet,
        orders,
        fetchUserOrders
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default Appstate;
