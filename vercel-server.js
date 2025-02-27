import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import {
  chatRouter,
  userRouter,
  managerRouter,
  organizationRouter,
  projectRouter,
  taskRouter,
  teamRouter,
  issueRouter,
} from './routes/index.js';

import connectDB from './utils/database.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Server API is running...');
});

app.use('/user', userRouter);
app.use('/manager', managerRouter);
app.use('/organization', organizationRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/team', teamRouter);
app.use('/chat', chatRouter);
app.use('/issue', issueRouter);

// Connect to the database before handling requests
connectDB();

// Instead of app.listen(), export the app for Vercel
export default app;
