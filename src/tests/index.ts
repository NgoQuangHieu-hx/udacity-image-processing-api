import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import fs from 'fs';
import sharp from 'sharp';
import routes from '../routes/index'

const app = express();
app.use(routes);

describe('GET /images', () => {
    let readFileSyncStub: sinon.SinonStub;
    let resizeStub: sinon.SinonStub;

    beforeEach(() => {
        const readFileSyncStub = sinon.stub(fs, 'readdirSync').returns(['test.jpg']);
        resizeStub = sinon.stub(sharp.prototype, 'resize').returnsThis();
        sinon.stub(sharp.prototype, 'toBuffer').resolves(Buffer.from('test image data'));
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return an error if filename is missing', async () => {
        const response = await request(app)
            .get('/images')
            .query({ width: '200', height: '200' });

        expect(response.status).toBe(500);
        expect(response.text).toContain('Input file is missing');
    });

    it('should return an error if width is invalid', async () => {
        const response = await request(app)
            .get('/images')
            .query({ filename: 'test', width: 'abc', height: '200' });

        expect(response.status).toBe(500);
        expect(response.text).toContain('Input Width is invalid');
    });

    it('should return an error if height is invalid', async () => {
        const response = await request(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: 'abc' });

        expect(response.status).toBe(500);
        expect(response.text).toContain('Input Height is invalid');
    });

    it('should return an error if file is not found', async () => {
        readFileSyncStub.returns([]);

        const response = await request(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: '200' });

        expect(response.status).toBe(500);
        expect(response.text).toContain('File not found');
    });

    it('should return the resized image if everything is correct', async () => {
        const response = await request(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: '200' });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/jpeg');
        expect(response.body).toEqual(Buffer.from('test image data'));
    });
});
