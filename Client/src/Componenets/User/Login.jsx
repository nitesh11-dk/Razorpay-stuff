import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext"; // Import AppContext

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: "",
  });

  const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle for admin login
  const navigate = useNavigate();
  const { loginUser, loginAdmin } = useContext(AppContext); // Add loginAdmin from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, adminKey } = formData;

    try {
      let message;
      if (isAdminLogin) {
        // Call loginAdmin function for admin login
        message = await loginAdmin(email, password, adminKey);
      } else {
        // Call loginUser function for normal login
        message = await loginUser(email, password);
      }

      if (message) {
       console.log("Login successful:", message);

        // Clear the form data
        setFormData({ email: "", password: "", adminKey: "" });

        
        navigate("/");
      } else {
        console.error("Login failed: No message returned");
      }
    } catch (error) {
     console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isAdminLogin ? "Admin Login" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          {isAdminLogin && (
            <div>
              <label className="block text-sm mb-1" htmlFor="adminKey">
                Admin Key
              </label>
              <input
                type="text"
                id="adminKey"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                placeholder="Enter admin key"
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                required={isAdminLogin}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          >
            {isAdminLogin ? "Login as Admin" : "Login"}
          </button>
        </form>
        <button
          className="mt-4 text-sm text-indigo-400 hover:underline"
          onClick={() => setIsAdminLogin(!isAdminLogin)}
        >
          {isAdminLogin ? "Switch to User Login" : "Switch to Admin Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
