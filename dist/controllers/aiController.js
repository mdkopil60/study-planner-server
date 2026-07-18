"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartRecommendation = exports.createStudyPlan = void 0;
const geminiService_1 = require("../services/geminiService");
const db_1 = require("../config/db");
const createStudyPlan = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const { subject, difficulty, hours, examDate, length } = req.body;
        const prompt = `Subject: ${subject}, Difficulty: ${difficulty}, Hours: ${hours}, Exam Date: ${examDate}, Length: ${length}`;
        const plan = await (0, geminiService_1.generateStudyPlan)(subject, difficulty, hours, examDate, length);
        const history = {
            userEmail,
            prompt,
            response: plan,
            type: 'StudyPlan',
            createdAt: new Date()
        };
        await db_1.db.collection('ai_histories').insertOne(history);
        res.json({ plan });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate study plan' });
    }
};
exports.createStudyPlan = createStudyPlan;
const getSmartRecommendation = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        // Fetch user's task history
        const tasks = await db_1.db.collection('study_tasks').find({ userEmail }).limit(20).toArray();
        const historyData = tasks.map(t => ({
            subject: t.subject,
            difficulty: t.difficulty,
            status: t.status
        }));
        const prompt = `Based on history: ${JSON.stringify(historyData)}`;
        const recommendation = await (0, geminiService_1.generateRecommendation)(historyData);
        const history = {
            userEmail,
            prompt,
            response: recommendation,
            type: 'Recommendation',
            createdAt: new Date()
        };
        await db_1.db.collection('ai_histories').insertOne(history);
        res.json({ recommendation });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate recommendation' });
    }
};
exports.getSmartRecommendation = getSmartRecommendation;
