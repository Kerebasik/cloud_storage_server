import {FileService} from "../services/fileService";
import {Request, Response} from "express";
import File, {IFile} from "../models/fileModel";
import { HydratedDocument } from 'mongoose';
import fs from "fs";
import {TCreateDir, TDeleteFile, TDowloadFile, TGetFiles, TUploadFile} from "../types/fileControllerType";
import {UploadedFile} from "express-fileupload";
import {ServerStatus} from "../enums/server/serverStatus";
import {ServerMessage} from "../enums/server/serverMessage";
import {RequestWithBody, RequestWithQuery} from "../types/requestType";
import User, {IUser} from "../models/userModel";
import MainAppConfig from "../config/appConfig";


export class FileController {
    static async createDir(req:Request<TCreateDir>, res:Response){
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, user:req.userId});
            const parentFile = await File.findOne({_id:parent})
            if(!parentFile) {
                file.path = name
                await FileService.createDir(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await FileService.createDir(file)
                parentFile.children.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(ServerStatus.Error).json(ServerMessage.Error)
        }
    }

    static async getFiles(req:RequestWithQuery<TGetFiles>, res:Response){
        try{
            const files = await File.find({user:req.userId, parent:req.query.parent})
            res.status(ServerStatus.Ok).json(files)
        } catch (e){
            console.log(e)
            res.status(ServerStatus.Error).json(ServerMessage.Error)
        }
    }

    static async uploadFile(req:RequestWithBody<TUploadFile>, res:Response){
        try {
            const file = req.files?.file as UploadedFile;

            const parent = await File.findOne({user: req.userId, _id:req.body.parent}) as HydratedDocument<IFile>
            const user = await User.findOne({_id:req.userId}) as HydratedDocument<IUser>

            if(user.usedStorage + file.size > user.diskStorage){
                res.status(ServerStatus.BadRequest).json({message:'No space on the disk'})
            }

            user.usedStorage = user.usedStorage + file.size;

            let path;

            if(parent){
                path = `${MainAppConfig.FILE_PATH}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${MainAppConfig.FILE_PATH}\\${user._id}\\${file.name}`
            }

            if(fs.existsSync(path)){
                return res.status(ServerStatus.BadRequest).json({message: 'File already exist'});
            }
            await file.mv(path);
            const type = file.name.split('.').pop();
            let filePath = file.name
            if(parent) {
                filePath = parent.path + '\\' + file.name
            }

            const newFile = new File({
                name:file.name,
                type,
                size:file.size,
                path: filePath,
                parent: parent?._id,
                user:user._id
            })


            await newFile.save();
            parent.children.push(newFile._id)
            await parent.save();
            await user.save();
            return res.status(201).json({message:'File is created'})
        } catch (e){
            console.log(e)
            return res.status(ServerStatus.Error).json({message:"Upload error"})
        }
    }

    static async downloadFile(req:RequestWithQuery<TDowloadFile>, res:Response){
        try {
            const file = await File.findOne({_id: req.query.id, user: req.userId}) as HydratedDocument<IFile>;
            const path = `${MainAppConfig.FILE_PATH}\\${req.userId}\\${file.path}\\${file.name}`;
            if(fs.existsSync(path)){
                return res.download(path, file.name)
            }
            return res.status(ServerStatus.BadRequest).json({message:ServerMessage.UncorrectedReq})
        } catch (e){
            console.log(e)
            return res.status(ServerStatus.Error).json({message:ServerMessage.Error})
        }

    }

    static async deleteFile(req:RequestWithQuery<TDeleteFile>, res:Response){
        try {
            const file = await File.findOne({_id:req.query.id, user:req.userId}) as HydratedDocument<IFile>;
            if(!file){
                return res.status(ServerStatus.NotFound).json({message:'File not found'})
            }
            FileService.deleteFileOrDir(file);
            await file.deleteOne();
            return res.status(ServerStatus.Ok).json({message:'File was delete'})
        } catch (e){
            console.log(e)
            return res.status(ServerStatus.Error).json({message:ServerMessage.Error})
        }
    }

}