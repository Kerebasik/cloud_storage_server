import mongoose, { Schema, model } from 'mongoose';
import { MongooseType } from '../types/mongoseType';

mongoose.set('strictQuery', true);

export interface IRefreshToken {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  token: mongoose.Schema.Types.String;
  date: mongoose.Schema.Types.Date;
}

const RefreshToken = new Schema<IRefreshToken>({
  user: { type: MongooseType.ObjectId, ref: 'User' },
  token: { type: MongooseType.String, required: true },
  date: { type: MongooseType.Date, default: Date.now() },
});

export default model('RefreshToken', RefreshToken);
