import fs from 'fs';
import Mongoose from "mongoose";
import MainAppConfig from "../config/appConfig";


type IMongoose = {
    name:{type: Mongoose.Schema.Types.String},
    type:{type: Mongoose.Schema.Types.String},
    access_link:{type:Mongoose.Schema.Types.String},
    path:{type: Mongoose.Schema.Types.String},
    size:{type: Mongoose.Schema.Types.Number},
    user:{type: Mongoose.Schema.Types.ObjectId},
    parent:{type: Mongoose.Schema.Types.ObjectId},
    childs:[{type: Mongoose.Schema.Types.ObjectId}]
}

export class FileService{
    static createDir(file:IMongoose){
        const filePath = `${MainAppConfig.FILE_PATH}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }
}

