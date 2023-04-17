import mongoose, { Schema, model } from 'mongoose';
import { MongooseType } from '../types/mongoseType';

mongoose.set('strictQuery', true);

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  subscription: mongoose.Schema.Types.ObjectId;
  usedStorage: number;
  activationLink: string;
  activated: boolean;
  avatar: string;
  files: mongoose.Schema.Types.ObjectId;
}

const User = new Schema<IUser>({
  email: { type: MongooseType.String, required: true, unique: true },
  password: { type: MongooseType.String, required: true },
  subscription: { type: MongooseType.ObjectId, ref: 'Subscription' },
  usedStorage: { type: MongooseType.Number, default: 0 },
  activationLink: { type: MongooseType.String, unique: true },
  activated: { type: MongooseType.Boolean, default: false },
  avatar: { type: MongooseType.String, default: '' },
  files: [{ type: MongooseType.ObjectId, ref: 'File' }],
});

export default model('User', User);
