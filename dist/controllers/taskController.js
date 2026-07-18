"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getPublicTasks = exports.getTaskById = exports.getTasks = void 0;
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
// Helper: safely extract and validate the :id route param
const getValidObjectId = (id) => {
    if (typeof id !== 'string' || !mongodb_1.ObjectId.isValid(id))
        return null;
    return new mongodb_1.ObjectId(id);
};
const getTasks = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const { search, subject, difficulty, sort, page = 1, limit = 10 } = req.query;
        const query = { userEmail };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (subject) {
            query.subject = subject;
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'deadlineAsc')
            sortOption = { deadline: 1 };
        else if (sort === 'deadlineDesc')
            sortOption = { deadline: -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const tasksCollection = db_1.db.collection('study_tasks');
        const tasks = await tasksCollection.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))
            .toArray();
        const total = await tasksCollection.countDocuments(query);
        res.json({
            tasks,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const taskId = getValidObjectId(req.params.id);
        if (!taskId)
            return res.status(400).json({ error: 'Invalid task id' });
        const task = await db_1.db.collection('study_tasks').findOne({ _id: taskId });
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};
exports.getTaskById = getTaskById;
const getPublicTasks = async (req, res) => {
    try {
        const { search, subject, difficulty, sort, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (subject) {
            query.subject = subject;
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'deadlineAsc')
            sortOption = { deadline: 1 };
        else if (sort === 'deadlineDesc')
            sortOption = { deadline: -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const tasksCollection = db_1.db.collection('study_tasks');
        const tasks = await tasksCollection.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))
            .toArray();
        const total = await tasksCollection.countDocuments(query);
        res.json({
            tasks,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch public tasks' });
    }
};
exports.getPublicTasks = getPublicTasks;
const createTask = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const newTask = {
            ...req.body,
            userEmail,
            createdAt: new Date(),
            status: req.body.status || 'Pending',
            deadline: new Date(req.body.deadline)
        };
        const result = await db_1.db.collection('study_tasks').insertOne(newTask);
        res.status(201).json({ ...newTask, _id: result.insertedId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const taskId = getValidObjectId(req.params.id);
        if (!taskId)
            return res.status(400).json({ error: 'Invalid task id' });
        // Handle date conversion if updating deadline
        const updateData = { ...req.body };
        if (updateData.deadline) {
            updateData.deadline = new Date(updateData.deadline);
        }
        delete updateData._id;
        const result = await db_1.db.collection('study_tasks').findOneAndUpdate({ _id: taskId, userEmail }, { $set: updateData }, { returnDocument: 'after' });
        if (!result)
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const taskId = getValidObjectId(req.params.id);
        if (!taskId)
            return res.status(400).json({ error: 'Invalid task id' });
        const result = await db_1.db.collection('study_tasks').findOneAndDelete({
            _id: taskId,
            userEmail
        });
        if (!result)
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
