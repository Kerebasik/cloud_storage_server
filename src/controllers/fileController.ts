import {FileService} from "../services/fileService";
import {Request, Response} from "express";
import File from "../models/fileModel";
import Mongoose from 'mongoose'
import {ServerStatus} from "../enums/server/serverStatus";
import {ServerMessage} from "../enums/server/serverMessage";

declare global {
    namespace Express {
        export interface Request {
            userId: string
        }
    }
}

export class FileController {
    static async createDir(req:Request<{},{}, { name: string, type:string, parent:Mongoose.Schema.Types.ObjectId }>, res:Response){
        try {
            const {name, type, parent} = req.body
            const file:any = new File({name, type, parent, user:req.userId});
            const parentFile = await File.findOne({_id:parent})
            if(!parentFile) {
                file.path = name
                await FileService.createDir(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await FileService.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(ServerStatus.Error).json(ServerMessage.Error)
        }
    }

    static async getFiles(req:Request, res:Response){
        try{
            const files:any = await File.find({user:req.userId, parent:req.query.parent})
            res.status(ServerStatus.Ok).json(files)
        } catch (e){
            console.log(e)
            res.status(ServerStatus.Error).json(ServerMessage.Error)
        }
    }
}