import express from 'express';
import users from './Users/usersRoute.js';
import auth from './auth/authRoutes.js';

const route = express.Router();

route.use('/users',users);
route.use('/auth', auth);

export default route;