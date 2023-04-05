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
import { RequestWithBody } from '../types/requestType';
import { HydratedDocument } from 'mongoose';
import { TInputRegistration, TInputLogin } from '../types/authControllerType';
import UserDto from '../dtos/userDto';
import TokenService from '../services/tokenService';
import TokenModel from '../models/tokenModel';

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

      const hashPassword = SHA256(password);
      const newUser = await User.create({ email, password: hashPassword });
      await FileService.createDir(
        req,
        new File({ user: newUser.id, name: '' }),
      );

      const tokens = await TokenService.generateTokens({ _id: newUser._id });
      await TokenModel.create({
        user: newUser._id,
        token: tokens.refreshToken,
      });
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
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
      const tokens = TokenService.generateTokens({ _id: user._id });
      await TokenModel.create({ user: user._id, token: tokens.refreshToken });
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(ServerStatus.Ok).json({
        ...tokens,
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

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const token = await TokenModel.findOneAndDelete({ token: refreshToken });
      res.clearCookie('refreshToken');
      return res.status(201).json({
        message: 'Logout',
        token,
      });
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }

  static refresh(req: Request, res: Response) {
    try {
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }
}
