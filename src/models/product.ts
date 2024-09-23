import Client from '../database';

export type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export class Product {
    async index(): Promise<ProductType[]> {
        try {
            const sql = "SELECT * FROM products"
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (error) {
            console.log(error);
            console.log('----------------');

            throw new Error('Cannot get products: ' + error)
        }
    }

    async show(id: string): Promise<ProductType> {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`)
        }
    }

    async create(p: ProductType): Promise<ProductType> {
        try {
            const sql = 'INSERT INTO products (name, description, price, quantity) VALUES($1, $2, $3, $4) RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [p.name, p.description, p.price, p.quantity])
            const product = result.rows[0]
            conn.release()
            return product
        } catch (err) {
            throw new Error(`Could not add new product ${p.name}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<ProductType> {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            const book = result.rows[0]
            conn.release()
            return book
        } catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`)
        }
    }
}