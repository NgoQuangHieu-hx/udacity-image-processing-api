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
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
routes.get('/images', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const assetsDir = path_1.default.join(__dirname, '../assets/full');
        const files = fs_1.default.readdirSync(assetsDir);
        const matchingFile = files.find(file => {
            const fileNameWithoutExt = path_1.default.parse(file).name;
            return fileNameWithoutExt === filename;
        });
        if (!matchingFile) {
            throw new Error('File not found');
        }
        const filePath = path_1.default.join(assetsDir, matchingFile);
        const imageBuffer = yield (0, sharp_1.default)(filePath)
            .resize(width, height)
            .toBuffer();
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(imageBuffer);
    }
    catch (error) {
        return res.send(`The following error occurred processing your image remedy and try again: ${error}`);
    }
}));
exports.default = routes;
