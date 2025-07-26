import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Payment from '../Models/Payment.js';
import Wallet from '../Models/Wallet.js';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create top-up order
export const createTopUp = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({ message: "Amount must be a whole number greater than 0." });
    }

    if (amount < 1 || amount > 5000) {
      return res.status(400).json({ message: "Amount must be between ₹1 and ₹5000." });
    }

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.user._id,
      orderId: order.id,
      amount,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId: order.id,
      amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('Razorpay createTopUp error:', err);
    res.status(500).json({ message: "Failed to create top-up order" });
  }
};

// ✅ Verify payment
export const verifyTopUp = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Order not found." });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id, balance: payment.amount });
    } else {
      wallet.balance += payment.amount;
      wallet.lastUpdated = Date.now();
    }
    await wallet.save();

    res.json({
      success: true,
      message: "Payment verified & wallet credited.",
      balance: wallet.balance
    });

  } catch (err) {
    console.error('Razorpay verifyTopUp error:', err);
    res.status(500).json({ message: "Failed to verify payment." });
  }
};

// ✅ Get user top-up orders
export const getUserTopUpOrders = async (req, res) => {
  try {
    const orders = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Razorpay getUserTopUpOrders error:', err);
    res.status(500).json({ message: "Failed to fetch user top-up orders." });
  }
};
