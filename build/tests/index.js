"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const sinon_1 = __importDefault(require("sinon"));
const sharp_1 = __importDefault(require("sharp"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../routes/index"));
const app = (0, express_1.default)();
app.use(index_1.default);
describe('GET /images', () => {
    let readFileSyncStub;
    let resizeStub;
    beforeEach(() => {
        const direntMock = {
            name: 'test.jpg',
            isFile: () => true,
            isDirectory: () => false,
            isSymbolicLink: () => false,
            isBlockDevice: () => false,
            isCharacterDevice: () => false,
            isFIFO: () => false,
            isSocket: () => false,
        };
        readFileSyncStub = sinon_1.default.stub(fs_1.default, 'readdirSync').returns([direntMock]);
        resizeStub = sinon_1.default.stub(sharp_1.default.prototype, 'resize').returnsThis();
        sinon_1.default.stub(sharp_1.default.prototype, 'toBuffer').resolves(Buffer.from('test image data'));
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should return an error if filename is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/images')
            .query({ width: '200', height: '200' });
        expect(response.status).toBe(500);
        expect(response.text).toContain('Input file is missing');
    }));
    it('should return an error if width is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/images')
            .query({ filename: 'test', width: 'abc', height: '200' });
        expect(response.status).toBe(500);
        expect(response.text).toContain('Input Width is invalid');
    }));
    it('should return an error if height is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: 'abc' });
        expect(response.status).toBe(500);
        expect(response.text).toContain('Input Height is invalid');
    }));
    it('should return an error if file is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        readFileSyncStub.returns([]);
        const response = yield (0, supertest_1.default)(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: '200' });
        expect(response.status).toBe(500);
        expect(response.text).toContain('File not found');
    }));
    it('should return the resized image if everything is correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/images')
            .query({ filename: 'test', width: '200', height: '200' });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/jpeg');
        expect(response.body).toEqual(Buffer.from('test image data'));
    }));
});
