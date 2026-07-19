import { Request, Response } from 'express';
import { generateStudyPlan, generateRecommendation } from '../services/geminiService';
import { db } from '../config/db';
import { IAIHistory } from '../models/AIHistory';
import { IStudyTask } from '../models/StudyTask';

export const createStudyPlan = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const { subject, difficulty, hours, examDate, length } = req.body;

    if (!subject || !difficulty || !hours || !examDate || !length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Subject: ${subject}, Difficulty: ${difficulty}, Hours: ${hours}, Exam Date: ${examDate}, Length: ${length}`;

    const plan = await generateStudyPlan(subject, difficulty, hours, examDate, length);

    const history: Omit<IAIHistory, '_id'> = {
      userEmail,
      prompt,
      response: plan,
      type: 'StudyPlan',
      createdAt: new Date()
    };

    await db.collection('ai_histories').insertOne(history);

    res.json({ plan });
  } catch (error: any) {
    console.error("createStudyPlan Error:", error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to generate study plan' });
  }
};

export const getSmartRecommendation = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const tasks = await db.collection<IStudyTask>('study_tasks').find({ userEmail }).limit(20).toArray();

    const historyData = tasks.map(t => ({
      subject: t.subject,
      difficulty: t.difficulty,
      status: t.status
    }));

    const prompt = `Based on history: ${JSON.stringify(historyData)}`;
    const recommendation = await generateRecommendation(historyData);

    const history: Omit<IAIHistory, '_id'> = {
      userEmail,
      prompt,
      response: recommendation,
      type: 'Recommendation',
      createdAt: new Date()
    };

    await db.collection('ai_histories').insertOne(history);

    res.json({ recommendation });
  } catch (error: any) {
    console.error("getSmartRecommendation Error:", error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to generate recommendation' });
  }
};