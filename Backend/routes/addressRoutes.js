import express from 'express'
import addressController from '../controllers/addressController.js';

const addressRouter = express.Router();

//create address
addressRouter.post('/', addressController.createAddress);

//get all address
addressRouter.get('/user/:user_id', addressController.getUserAddress);
addressRouter.get('/:id', addressController.getAddress);
addressRouter.put('/:id', addressController.updateAddress);

addressRouter.delete('/:id', addressController.deleteAddress);

export default addressRouter;