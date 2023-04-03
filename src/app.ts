import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';
import fileRouter from './routes/fileRoutes';
import expressFileUpload from './middleware/fileUploadMiddleware';
import cors from './middleware/corsMiddleware';
import userRouter from './routes/userRoutes';
import filePathMiddleware from './middleware/filePathMiddleware';
import path from 'path';
import fs from 'fs';

import * as swaggerDocument from './swagger.json';

import swaggerUi from 'swagger-ui-express';
import avatarPath from './middleware/avatarPathModdleware';

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
app.use(cors);
app.use(filePathMiddleware(path.resolve(__dirname, 'files')));
app.use(avatarPath(path.resolve(__dirname, 'static')));
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRouter);
app.use('/api/user', userRouter);

export default app;
