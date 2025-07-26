import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: String,      // Razorpay order ID
  paymentId: String,    // Razorpay payment ID
  signature: String,
  amount: Number,       // amount in INR
  status: { type: String, default: 'pending' }, // 'pending' | 'paid' | 'failed'
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
