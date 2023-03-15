import mongoose, {Schema, model} from 'mongoose';
import {MongooseType} from "../types/mongoose/mongoseType";

mongoose.set('strictQuery', true)

const File = new Schema({
    name:{type: MongooseType.String, required:true},
    type:{type: MongooseType.String, required: true},
    access_link:{type:MongooseType.String},
    path:{type: MongooseType.String, default: ""},
    size:{type: MongooseType.Number, default:0},
    user:{type: MongooseType.ObjectId, ref:"User"},
    parent:{type: MongooseType.ObjectId, ref:"File"},
    child:[{type: MongooseType.ObjectId, ref:"File"}]
})

export default model('File', File)