import mongoose, {Schema, model} from "mongoose";
import {MongooseType} from "../types/mongoose/mongoseType";

mongoose.set('strictQuery', true)

const User = new Schema({
    email:{type:MongooseType.String, required: true, unique:true},
    password:{type:MongooseType.String, required:true},
    diskStorage: {type: MongooseType.Number, default:1024**3*10},
    usedStorage:{type:MongooseType.Number, default: 0},
    avatar:{type:MongooseType.String},
    files:[{ type: MongooseType.ObjectId , ref:"File"}]
})

export default model('User', User)