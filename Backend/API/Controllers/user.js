import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Wallet from '../Models/Wallet.js';


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists. Please use a different email."
      });
    }

    // 2️⃣ Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create new user
    const user = new User({ name, email, password: hashPassword });
    await user.save();

    // 4️⃣ 🔒 Immediately create a wallet for this user
    const wallet = new Wallet({
      userId: user._id,
      balance: 0
    });
    await wallet.save();

    // ✅ Done — return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully & wallet created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      wallet: {
        id: wallet._id,
        balance: wallet.balance
      }
    });

  } catch (error) {
    console.error("Error registering user:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected. This email is already registered."
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later."
    });
  }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Then send the JSON response
        return res.status(200).json({
            message: "Login successful",
            success: true,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};


export const loginAdmin = async (req, res) => {
    try {
        const { email, password, adminKey } = req.body;

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        // Check if the password is correct
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        // Admin key validation
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ message: "Admin key is wrong", success: false });
        }

        // First-time admin login, update isAdmin
        if (!user.isAdmin) {
            user.isAdmin = true;
            user.role = "admin";
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Respond with token and success message
        return res.status(200).json({
            message: "Admin login successful",
            success: true,
            token,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in admin", success: false });
    }
};


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ user, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user", success: false });
    }
}

export const editUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

       
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
        }

      
        await user.save();

        res.status(200).json({ message: "User updated successfully", success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user", success: false });
    }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 👉 Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found with the given ID.",
        success: false
      });
    }

    // 👉 Check if user has wallet balance
    const wallet = await Wallet.findOne({ userId: id });
    if (wallet && wallet.balance > 0) {
      return res.status(400).json({
        message: `User cannot be deleted. Wallet balance is ₹${wallet.balance}. Please contact admin.`,
        success: false
      });
    }

    // 👉 Delete the user
    await User.findByIdAndDelete(id);

    // 👉 Optionally, also delete empty wallet
    if (wallet) {
      await Wallet.findByIdAndDelete(wallet._id);
    }

    res.status(200).json({
      message: "User deleted successfully.",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting user." + error,
      success: false
    });
  }
};





// ADMIN
export const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users", success: false });
    }
}



export const toggleUserAdmin = async (req, res) => {
    try {
        const { id } = req.params; 

       
        const user = await User.findById(id); 

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        
        user.isAdmin = !user.isAdmin;
        user.role = user.isAdmin ? "admin" : "user";
        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: `User admin status updated successfully to ${updatedUser.isAdmin}`,
            isAdmin: updatedUser.isAdmin
        });
    } catch (error) {
        console.error('Error toggling admin status:', error);
        res.status(500).json({ success: false, message: 'An error occurred while toggling admin status.' });
    }
};


export const isUserAdmin = async (req, res, next) => {
    try {
        const token = req.header('Auth');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch the user from the database
        const user = await User.findById(userId); // Adjust based on your DB setup
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check if the user has an admin role
        if (!user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }
        return res.status(200).json({ success: true, message: 'User is Admin.' });

    } catch (error) {
        console.error('Error verifying admin:', error);
        res.status(400).json({ success: false, message: 'Invalid token or access denied.' });
    }
};
