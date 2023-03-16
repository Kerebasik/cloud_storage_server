import {ServerStatus} from "../enums/server/serverStatus";
import {ServerMessage, ServerMessageUser} from "../enums/server/serverMessage";
import { body, validationResult } from 'express-validator';
import User from '../models/userModel';
import express, {Response, Request} from "express";
import SHA256 from "crypto-js/sha256";
import jwt from 'jsonwebtoken';
import MainAppConfig from "../config/appConfig";
import {PassValid} from "../services/auth/auth";
import authMiddleware from "../middleware/authMiddleware";
import File from "../models/fileModel";
import {FileService} from "../services/fileService";
const authRoutes = express.Router();


authRoutes.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:12}),
    async (req:Request, res:Response) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(ServerStatus.BadRequest).json({message:ServerMessage.UncorrectedReq, errors})
        }
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if(candidate){
            return  res.status(ServerStatus.BadRequest).json({message:ServerMessageUser.UserWithEmailAlready});
        }

        const hashPassword = await SHA256(password);

        const newUser = await User.create({email, password:hashPassword});

        await FileService.createDir(new File({user:newUser.id, name:''}) as any)
        return res.status(ServerStatus.Ok).json({message:ServerMessageUser.UserCreated});
    } catch (e){
        console.log(e);
        return res.status(ServerStatus.Error).json({message: ServerMessage.Error});
    }
})

authRoutes.post('/login', async (req:Request, res:Response) =>{
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(ServerStatus.NotFound).json({message: ServerMessageUser.UserNotFound});
            }
            const isPassValid = PassValid(password, user.password);
            if(!isPassValid){
                return res.status(ServerStatus.NotFound).json({message:ServerMessageUser.UserPassIsNotValid})
            }

            const token = jwt.sign({id:user._id}, MainAppConfig.SECRET_KEY, { expiresIn: '1h' });

            return res.status(ServerStatus.Ok).json({
                token,
                user: {
                    user: user._id,
                    email: user.email,
                    diskStorage: user.diskStorage,
                    usedStorage: user.usedStorage,
                    avatar: user.avatar,
                    files: user.files
                }
            });
        } catch (e){
            console.log(e);
            return res.status(ServerStatus.Error).json({message: ServerMessage.Error});
        }
})

authRoutes.post('/auth', authMiddleware,
    async (req:Request, res:Response) =>{
    try{
        const user = await User.findOne({_id:req.userId})
        return res.status(ServerStatus.Ok).json(user)
    } catch (e){
        console.log(e);
        return res.status(ServerStatus.Error).json({message: ServerMessage.Error});
    }
})

export default authRoutes;