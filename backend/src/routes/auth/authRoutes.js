import express from 'express';
import { loginUser,registerUser } from '../../controllers/auth/authController.js';

const auth = express.Router();

auth.post('/login', loginUser);
auth.post('/register', registerUser);

export default auth;