import express from 'express';
import { createProperty,updateProperty,deleteProperty,getAllProperties,getPropertyById } from '../../controllers/Property/index.js';

const property = express.Router();

property.get('/', getAllProperties);
property.get('/:id', getPropertyById);
property.put('/:id', updateProperty);
property.delete('/:id', deleteProperty);
property.post('/', createProperty);

export default property;