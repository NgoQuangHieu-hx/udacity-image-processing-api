import express from 'express';
const routes = express.Router();
import { getProduct } from '../controller/product.controller';

routes.get('products', getProduct)

export default routes;