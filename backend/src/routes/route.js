import express from 'express';
import users from './Users/usersRoute.js';

const route = express.Router();

route.use('/users',users);

export default route;