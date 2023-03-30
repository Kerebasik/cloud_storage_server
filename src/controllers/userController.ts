import {Request, Response} from 'express';
import User, { IUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';
import { ServerStatus } from '../enums/server/serverStatus';
import { ServerMessage, ServerMessageFile } from '../enums/server/serverMessage';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import MainAppConfig from '../config/appConfig';
import fs from 'fs';

export class UserController{
  static async uploadAvatar(req:Request, res:Response){
    try {
      const file = req.files?.file as UploadedFile
      if(!file){
        res.status(ServerStatus.NotFound).json(ServerMessageFile.FileNotFound)
      }
      const user = await User.findById(req.userId) as HydratedDocument<IUser>
      const userAvatar = uuidv4() + file.name
      const path =`${MainAppConfig.AVATAR_PATH}\\${userAvatar}`
      user.avatar = userAvatar
      await file.mv(path)
      await user.save();
      return res.status(ServerStatus.Ok).json(user)
    } catch (e){
      console.log(e)
      return res.status(ServerStatus.Error).json(ServerMessage.Error)
    }
  }

  static async deleteAvatar(req:Request, res:Response){
    try {
      const user = await User.findById(req.userId) as HydratedDocument<IUser>
      fs.unlink(`${MainAppConfig.AVATAR_PATH}\\${user.avatar}`, ()=>{
        user.avatar = undefined;
      })
      await user.save()
      return res.status(ServerStatus.ObjectCreated).json('Avatar was delete')
    } catch (e){
      console.log(e)
      return res.status(ServerStatus.Error).json(ServerMessage.Error)
    }
  }
}