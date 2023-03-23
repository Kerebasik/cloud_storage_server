import mongoose, {Schema, model} from 'mongoose';
import {MongooseType} from "../types/mongoose/mongoseType";

mongoose.set('strictQuery', true)

export interface IFile {
    _id:mongoose.Schema.Types.ObjectId,
    name:string,
    type:string,
    access_link?:string,
    path:string,
    date:Date,
    size:number,
    user:mongoose.Schema.Types.ObjectId,
    parent?:mongoose.Schema.Types.ObjectId,
    children:[mongoose.Schema.Types.ObjectId]
}


const File = new Schema<IFile>({
    name:{type: MongooseType.String, required:true},
    type:{type: MongooseType.String, required: true},
    access_link:{type:MongooseType.String},
    path:{type: MongooseType.String, default: ""},
    date:{type: MongooseType.Date, default: Date.now()},
    size:{type: MongooseType.Number, default:0},
    user:{type: MongooseType.ObjectId, ref:"User"},
    parent:{type: MongooseType.ObjectId, ref:"File"},
    children:[{type: MongooseType.ObjectId, ref:"File"}]
})

export default model('File', File)