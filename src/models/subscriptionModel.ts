import mongoose, { Schema, model } from 'mongoose';
import { MongooseType } from '../types/mongoseType';

export interface ISubscription {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  priceInCents: number;
  stripePriceApiId: string;
  diskStorage: number;
}

const Subscription = new Schema<ISubscription>({
  name: { type: MongooseType.String, unique: true, required: true },
  priceInCents: { type: MongooseType.Number, required: true },
  stripePriceApiId: { type: MongooseType.String, required: true, unique: true },
  diskStorage: {
    type: MongooseType.Number,
    required: true,
    default: 1024 ** 3 * 10,
  },
});

export default model('Subscription', Subscription);
