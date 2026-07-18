"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/public', taskController_1.getPublicTasks);
router.get('/public/:id', taskController_1.getTaskById);
// Protected routes
router.use(authMiddleware_1.requireAuth);
router.get('/', taskController_1.getTasks);
router.post('/', taskController_1.createTask);
router.put('/:id', taskController_1.updateTask);
router.delete('/:id', taskController_1.deleteTask);
exports.default = router;
