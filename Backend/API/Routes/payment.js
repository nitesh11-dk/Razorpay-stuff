import express from 'express';
import { AuthenticateUser } from '../Middlewares/auth.js';
import { createTopUp, verifyTopUp ,getUserTopUpOrders} from '../Controllers/payment.js';

const router = express.Router();

router.post('/topup', AuthenticateUser, createTopUp);
router.post('/verify', AuthenticateUser, verifyTopUp);
router.get('/get-orders', AuthenticateUser,getUserTopUpOrders );

export default router;
