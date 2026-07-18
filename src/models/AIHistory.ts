import { ObjectId } from 'mongodb';

export interface IAIHistory {
  _id?: ObjectId;
  userEmail: string;
  prompt: string;
  response: string;
  type: 'StudyPlan' | 'Recommendation';
  createdAt: Date;
}
