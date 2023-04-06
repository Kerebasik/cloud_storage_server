import jwt from 'jsonwebtoken';
import TokenModel, { IRefreshToken } from '../models/tokenModel';
import { TDecode } from '../middleware/authMiddleware';
import * as Mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  static generateTokens(payload: object): ITokens {
    const accessToken = jwt.sign(
      payload,
      String(process.env.ACCESS_TOKEN_SECRET_KEY),
      { expiresIn: '30m' },
    );
    const refreshToken = jwt.sign(
      payload,
      String(process.env.REFRESH_TOKEN_SECRET_KEY),
      { expiresIn: '30d' },
    );
    return { accessToken, refreshToken };
  }

  static validateAccessToken(accessToken: string) {
    try {
      const tokenData = jwt.verify(
        accessToken,
        String(process.env.ACCESS_TOKEN_SECRET_KEY),
      );
      return tokenData;
    } catch (e) {
      console.log(e);
    }
  }

  static validateRefreshToken(refreshToken: string) {
    try {
      const tokenData: TDecode = Object(
        jwt.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET_KEY)),
      );
      return tokenData;
    } catch (e) {
      console.log(e);
    }
  }

  static async findToken(token: string) {
    const tokenFromDB = await TokenModel.findOne({ token: token });
    return tokenFromDB;
  }

  static async removeToken(refreshToken: IRefreshToken) {
    try {
      const tokenDelete = await TokenModel.findOneAndDelete({
        token: refreshToken,
      });
      return tokenDelete;
    } catch (e) {
      console.log(e);
    }
  }

  static async saveToken(
    userId: Mongoose.Schema.Types.ObjectId,
    refreshToken: string,
  ) {
    const tokenData = (await TokenModel.findOne({
      user: userId,
    })) as HydratedDocument<IRefreshToken>;
    let token;
    if (tokenData) {
      tokenData.token = refreshToken;
      await tokenData.save();
    }
    token = await TokenModel.create({
      user: userId,
      token: refreshToken,
    });
    return token;
  }
}

export default TokenService;
