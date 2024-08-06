import express from 'express';
const routes = express.Router();
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

routes.get('/images', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filename = typeof req.query.filename === 'string' ? req.query.filename : '';
        const width = typeof req.query.width === 'string' ? parseInt(req.query.width, 10) : NaN;
        const height = typeof req.query.height === 'string' ? parseInt(req.query.height, 10) : NaN;

        if (!filename) {
            throw new Error('Input file is missing');
        }

        if (isNaN(width) || width <= 0) {
            throw new Error('Input Width is invalid');
        }

        if (isNaN(height) || height <= 0) {
            throw new Error('Input Height is invalid');
        }

        const assetsDir = path.join(__dirname, '../assets/full');
        const files = fs.readdirSync(assetsDir);
        const matchingFile = files.find(file => {
            const fileNameWithoutExt = path.parse(file).name;
            return fileNameWithoutExt === filename;
        });

        if (!matchingFile) {
            throw new Error('File not found');
        }

        const filePath = path.join(assetsDir, matchingFile);
        const imageBuffer = await sharp(filePath)
            .resize(width, height)
            .toBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(imageBuffer);

    } catch (error) {
        return res.send(`The following error occurred processing your image remedy and try again: ${error}`);
    }
})

export default routes;