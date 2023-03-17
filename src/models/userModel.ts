import mongoose, {Schema, model} from "mongoose";
import {MongooseType} from "../types/mongoose/mongoseType";

mongoose.set('strictQuery', true)

export interface IUser {
    _id:mongoose.Schema.Types.ObjectId,
    email:string,
    password:string,
    diskStorage?: number,
    usedStorage?:number,
    avatar?:string,
    files?:mongoose.Schema.Types.ObjectId
}

const User = new Schema<IUser>({
    email:{type:MongooseType.String, required: true, unique:true},
    password:{type:MongooseType.String, required:true},
    diskStorage: {type: MongooseType.Number, default:1024**3*10},
    usedStorage:{type:MongooseType.Number, default: 0},
    avatar:{type:MongooseType.String},
    files:[{ type: MongooseType.ObjectId , ref:"File"}]
})

export default model('User', User)