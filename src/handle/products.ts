import express, { Request, Response } from 'express'
import { ProductType, Product } from '../models/product'

const product = new Product()

const index = async (_req: Request, res: Response) => {
    const products = await product.index()
    res.json(products)
}

const show = async (_req: Request, res: Response) => {
    const id: string = _req.params.id;
    const products = await product.show(id)
    res.json(products)
}

const create = async (req: Request, res: Response) => {
    const newProduct: ProductType = {
        id: 0,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    };
    const createdProduct = await product.create(newProduct);
    res.json(createdProduct);
};

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show);
    app.post('/products', create);
}

export default product_routes