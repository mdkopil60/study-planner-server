"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = require("../config/db");
const getDashboardStats = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail)
            return res.status(401).json({ error: 'Unauthorized' });
        const tasksCol = db_1.db.collection('study_tasks');
        const aiHistoriesCol = db_1.db.collection('ai_histories');
        const totalTasks = await tasksCol.countDocuments({ userEmail });
        const completedTasks = await tasksCol.countDocuments({ userEmail, status: 'Completed' });
        const pendingTasks = await tasksCol.countDocuments({ userEmail, status: 'Pending' });
        const aiPlansGenerated = await aiHistoriesCol.countDocuments({ userEmail, type: 'StudyPlan' });
        const recentTasks = await tasksCol.find({ userEmail })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        const upcomingDeadlines = await tasksCol.find({ userEmail, status: 'Pending', deadline: { $gte: new Date() } })
            .sort({ deadline: 1 })
            .limit(5)
            .toArray();
        // Dummy data for charts
        const weeklyProgress = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [completedTasks > 0 ? 1 : 0, 0, 0, 0, 0, 0, 0] // simplified
        };
        res.json({
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                aiPlansGenerated
            },
            recentTasks,
            upcomingDeadlines,
            weeklyProgress
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
