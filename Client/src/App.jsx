import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Componenets/Layout";
import Dashboard from "./Componenets/Dashboard";
import TopUp from "./Componenets/helpers/TopUp";
import Register from "./Componenets/User/Register";
import Login from "./Componenets/User/Login";
import Profile from "./Componenets/User/Profile";
import EditUser from "./Componenets/User/EditUser";
import Orders from "./Componenets/Orders";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Parent route with navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="topup" element={<TopUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edituser" element={<EditUser />} />
          <Route path="topuporders" element={<Orders />} />
        </Route>

        {/* Auth routes outside layout (optional) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
