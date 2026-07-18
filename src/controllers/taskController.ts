import { Request, Response } from 'express';
import { db } from '../config/db';
import { ObjectId } from 'mongodb';
import { IStudyTask } from '../models/StudyTask';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const { search, subject, difficulty, sort, page = 1, limit = 10 } = req.query;
    const query: any = { userEmail };

    if (search) {
      query.title = { $regex: search as string, $options: 'i' };
    }
    if (subject) {
      query.subject = subject;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'deadlineAsc') sortOption = { deadline: 1 };
    else if (sort === 'deadlineDesc') sortOption = { deadline: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const tasksCollection = db.collection<IStudyTask>('study_tasks');
    
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await db.collection<IStudyTask>('study_tasks').findOne({ _id: new ObjectId(req.params.id) });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const getPublicTasks = async (req: Request, res: Response) => {
  try {
    const { search, subject, difficulty, sort, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (search) {
      query.title = { $regex: search as string, $options: 'i' };
    }
    if (subject) {
      query.subject = subject;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'deadlineAsc') sortOption = { deadline: 1 };
    else if (sort === 'deadlineDesc') sortOption = { deadline: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const tasksCollection = db.collection<IStudyTask>('study_tasks');

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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const newTask: Omit<IStudyTask, '_id'> = {
      ...req.body,
      userEmail,
      createdAt: new Date(),
      status: req.body.status || 'Pending',
      deadline: new Date(req.body.deadline)
    };

    const result = await db.collection('study_tasks').insertOne(newTask);
    res.status(201).json({ ...newTask, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    // Handle date conversion if updating deadline
    const updateData = { ...req.body };
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    delete updateData._id;

    const result = await db.collection<IStudyTask>('study_tasks').findOneAndUpdate(
      { _id: new ObjectId(req.params.id), userEmail },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Task not found or unauthorized' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const result = await db.collection('study_tasks').findOneAndDelete({ 
      _id: new ObjectId(req.params.id), 
      userEmail 
    });
    
    if (!result) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
