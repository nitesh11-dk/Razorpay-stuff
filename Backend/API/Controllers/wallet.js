

import Wallet from "../Models/Wallet.js";  // adjust path if needed

export const getWallet = async (req, res) => {
  try {
    // If you use Auth middleware, get userId from req.user or req.userId
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID",
      });
    }

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      wallet: {
        balance: wallet.balance,
      },
    });
  } catch (err) {
    console.error("Error fetching wallet:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
