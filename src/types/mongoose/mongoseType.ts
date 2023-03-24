import mongoose from 'mongoose';

export const MongooseType = {
  ObjectId: mongoose.Schema.Types.ObjectId,
  Number: mongoose.Schema.Types.Number,
  String: mongoose.Schema.Types.String,
  Date: mongoose.Schema.Types.Date,
};
