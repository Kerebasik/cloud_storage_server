import app from './app';
import MainAppConfig from './config/appConfig';
import mongoose from 'mongoose';

const PORT: number = Number(process.env.PORT) || MainAppConfig.PORT;
const DB_URL: string = MainAppConfig.DB_URL;

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
