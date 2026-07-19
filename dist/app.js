"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./config/auth");
const tasks_1 = __importDefault(require("./routes/tasks"));
const ai_1 = __importDefault(require("./routes/ai"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const node_1 = require("better-auth/node");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// ⚠️ Better Auth রুট অবশ্যই express.json()-এর আগে বসাতে হবে
app.use("/api/auth", (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Custom Routes
app.use('/api/tasks', tasks_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/dashboard', dashboard_1.default);
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
exports.default = app;
