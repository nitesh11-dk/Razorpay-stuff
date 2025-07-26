import express from 'express';
import { AuthenticateUser } from '../Middlewares/auth.js';
import { getWallet } from '../Controllers/wallet.js';

const router = express.Router();

router.get('/getbalance', AuthenticateUser, getWallet);

export default router;
