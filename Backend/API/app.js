import express from "express";
import { connectDb } from "./config/dbconfig.js";
import cors from "cors";
import user from "./Routes/user.js";
import payment from "./Routes/payment.js";
import wallet from "./Routes/wallet.js";


const PORT = process.env.PORT || 3000;
const app = express();
import dotenv from "dotenv";

dotenv.config();
connectDb();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", user);
app.use("/api/payment", payment);
app.use("/api/wallet", wallet);




app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
