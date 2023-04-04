import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ServerStatus } from '../enums/server/serverStatus';
import {
  ServerMessage,
  ServerMessageUser,
} from '../enums/server/serverMessage';
import User, { IUser } from '../models/userModel';
import SHA256 from 'crypto-js/sha256';
import { FileService } from '../services/fileService';
import File from '../models/fileModel';
import { PassValid } from '../services/authService';
import jwt from 'jsonwebtoken';
import MainAppConfig from '../config/appConfig';
import { RequestWithBody } from '../types/requestType';
import { HydratedDocument } from 'mongoose';
import { TInputRegistration, TInputLogin } from '../types/authControllerType';
import UserDto from '../dtos/userDto';

export class AuthController {
  static async registration(
    req: RequestWithBody<TInputRegistration>,
    res: Response,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(ServerStatus.BadRequest)
          .json({ message: ServerMessage.UncorrectedReq, errors });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(ServerStatus.Conflict)
          .json({ message: ServerMessageUser.UserWithEmailAlready });
      }
      const hashPassword = await SHA256(password);
      const newUser = await User.create({ email, password: hashPassword });
      await FileService.createDir(
        req,
        new File({ user: newUser.id, name: '' }),
      );
      return res
        .status(ServerStatus.ObjectCreated)
        .json({ message: ServerMessageUser.UserCreated });
    } catch (e) {
      console.log(e);
      return res
        .status(ServerStatus.Error)
        .json({ message: ServerMessage.Error });
    }
  }

  static async login(req: RequestWithBody<TInputLogin>, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(ServerStatus.NotFound)
          .json({ message: ServerMessageUser.UserNotFound });
      }
      const isPassValid = PassValid(password, user.password);
      if (!isPassValid) {
        return res
          .status(ServerStatus.Unauthorized)
          .json({ message: ServerMessageUser.UserPassIsNotValid });
      }
      const token = jwt.sign({ id: user._id }, MainAppConfig.SECRET_KEY, {
        expiresIn: '30m',
      });
      return res.status(ServerStatus.Ok).json({
        token,
      });
    } catch (e) {
      console.log(e);
      return res
        .status(ServerStatus.Error)
        .json({ message: ServerMessage.Error });
    }
  }

  static async auth(req: Request, res: Response) {
    try {
      const user = (await User.findOne({
        _id: req.userId,
      })) as HydratedDocument<IUser>;

      const userDto = new UserDto(user);

      return res.status(ServerStatus.Ok).json(userDto);
    } catch (e) {
      console.log(e);
      return res
        .status(ServerStatus.Error)
        .json({ message: ServerMessage.Error });
    }
  }

  static async logout(req: Request, res: Response) {}
}
