import express from 'express';
import users from './Users/usersRoute.js';
import rsl from './rsl/rslRoute.js';

const route = express.Router();

route.use('/api/users',users);
route.use('/api/rsl', rsl);

export default route;