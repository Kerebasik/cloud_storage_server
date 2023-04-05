import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';
import fileRouter from './routes/fileRoutes';
import expressFileUpload from './middleware/fileUploadMiddleware';
import cors from './middleware/corsMiddleware';
import userRouter from './routes/userRoutes';
import filePathMiddleware from './middleware/filePathMiddleware';
import path from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';

import * as swaggerDocument from './swagger.json';

import swaggerUi from 'swagger-ui-express';
import avatarPath from './middleware/avatarPathModdleware';

dotenv.config();

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
app.use(avatarPath(path.resolve(__dirname, 'static')));
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRouter);
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
