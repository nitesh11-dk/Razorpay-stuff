import express from 'express';
import { getProfile, loginUser, registerUser, allUsers, deleteUser, loginAdmin, isUserAdmin ,editUser,toggleUserAdmin } from '../Controllers/user.js';
import { AuthenticateAdmin, AuthenticateUser } from "../Middlewares/auth.js";
const router = express.Router();


//  user route 
router.post('/register', registerUser); // => /api/user/register
router.post('/login', loginUser);
router.post('/loginadmin', loginAdmin);
router.get('/checkadmin', isUserAdmin);
router.get('/profile', AuthenticateUser, getProfile);
router.post('/editUser', AuthenticateUser, editUser);
router.delete('/:id', AuthenticateUser, deleteUser);


//  ADMIN 
router.get('/all', AuthenticateUser, AuthenticateAdmin, allUsers);
router.put('/toggleuseradmin/:id', AuthenticateUser, AuthenticateAdmin, toggleUserAdmin);

export default router;