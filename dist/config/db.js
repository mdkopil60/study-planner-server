"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
exports.client = new mongodb_1.MongoClient(uri);
exports.db = exports.client.db('study-planner');
const connectDB = async () => {
    try {
        await exports.client.connect();
        console.log(`MongoDB Connected: ${uri.split('@')[1]?.split('/')[0] || 'localhost'}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
