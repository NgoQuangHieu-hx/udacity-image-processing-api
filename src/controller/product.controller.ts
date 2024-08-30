import { Request, Response, NextFunction } from "express";

async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('HieuNQ14');
}

export { getProduct }