import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import mongoose from 'mongoose';
import express, { Express } from 'express';
import authRouter from './routes/authRoutes';
import fileRouter from './routes/fileRoutes';
import expressFileUpload from './middleware/fileUploadMiddleware';
import cors from './middleware/corsMiddleware';
import userRouter from './routes/userRoutes';
import filePathMiddleware from './middleware/filePathMiddleware';
import cookieParser from 'cookie-parser';
import fs from 'fs';

import * as swaggerDocument from './swagger.json';

import swaggerUi from 'swagger-ui-express';
import avatarPathMiddleware from './middleware/avatarPathModdleware';
import subscriptionRouter from './routes/subscriptionRoutes';

(() => {
  try {
    if (!fs.existsSync(`${path.resolve(__dirname, 'files')}`)) {
      fs.mkdirSync(`${path.resolve(__dirname, 'files')}`, { recursive: false });
    }

    if (!fs.existsSync(`${path.resolve(__dirname, 'static')}`)) {
      fs.mkdirSync(`${path.resolve(__dirname, 'static')}`, {
        recursive: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
})();

const app: Express = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(expressFileUpload);
app.use(cookieParser());
app.use(cors);
app.use(filePathMiddleware(path.resolve(__dirname, 'files')));
app.use(avatarPathMiddleware(path.resolve(__dirname, 'static')));
app.use('/api/auth', authRouter);
app.use('/api/file', fileRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/user', userRouter);

const PORT: number = Number(process.env.PORT) || 3000;
const DB_URL: string = 'mongodb://127.0.0.1:27017/cloudStorageDB';

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log('Server is ready');
    });
  } catch (e) {
    console.error(e);
  }
};

start();
