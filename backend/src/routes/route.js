import express from 'express';
import users from './Users/usersRoute.js';
import rsl from './rsl/rslRoute.js';
import staff from './staff/staffRoute.js';

const route = express.Router();

route.use('/api/users',users);
route.use('/api/rsl', rsl);
route.use('/api/staff', staff);

export default route;