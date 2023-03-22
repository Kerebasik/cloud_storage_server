import jwt from 'jsonwebtoken';
import {NextFunction, Response, Request} from "express";
import {ServerMessage} from "../enums/server/serverMessage";
import {ServerStatus} from "../enums/server/serverStatus";
import appConfig from "../config/appConfig";

declare global {
    namespace Express {
        export interface Request {
            userId:string
        }
    }
}

type TDecode = {
    id:string,
    iat:number,
    exp:number
}


export default function (req:Request, res:Response, next:NextFunction){
    if(req.method==="OPTIONS"){
        return next()
    }
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(ServerStatus.Unauthorized).json({message:ServerMessage.AuthError})
        }
        const decode:TDecode = Object(jwt.verify(token, appConfig.SECRET_KEY))
        req.userId = decode.id;
        return next()
    } catch (e){
        console.log(e)
        return res.status(ServerStatus.Unauthorized).json({message:ServerMessage.AuthError})
    }
}