import express from 'express';
import cors from 'cors';
import { auth } from './config/auth';
import taskRoutes from './routes/tasks';
import aiRoutes from './routes/ai';
import dashboardRoutes from './routes/dashboard';
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth API Route
app.use("/api/auth", toNodeHandler(auth));

// Custom Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
