import { ObjectId } from 'mongodb';

export interface IStudyTask {
  _id?: ObjectId;
  userEmail: string;
  title: string;
  subject: string;
  shortDescription: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: Date;
  image?: string;
  status: 'Pending' | 'Completed';
  createdAt: Date;
}
