import express from 'express';
import users from './Users/usersRoute.js';
import auth from './auth/authRoutes.js';
import rsl from './rsl/rslRoute.js';

const route = express.Router();

route.use('/users',users);
route.use('/auth', auth);
route.use('/rsl', rsl);

export default route;