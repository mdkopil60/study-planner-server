import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI as string || 'mongodb://localhost:27017';
export const client = new MongoClient(uri);
export const db: Db = client.db('study-planner');

const connectDB = async () => {
  try {
    await client.connect();
    console.log(`MongoDB Connected: ${uri.split('@')[1]?.split('/')[0] || 'localhost'}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
