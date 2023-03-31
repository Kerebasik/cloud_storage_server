import mongoose, {Schema, model} from 'mongoose';
import {MongooseType} from '../types/mongoose/mongoseType';

mongoose.set('strictQuery', true);

 export interface IRefreshToken {
  _id:mongoose.Schema.Types.ObjectId;
  user:mongoose.Schema.Types.ObjectId;
  token:mongoose.Schema.Types.String;
}

const RefreshToken = new Schema<IRefreshToken>({
  user:{type:MongooseType.ObjectId, ref:'User'},
  token:{type: MongooseType.String, required:true}
})

export default model('RefreshToken', RefreshToken)