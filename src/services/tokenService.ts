import jwt from 'jsonwebtoken';
import { IRefreshToken } from '../models/tokenModel';

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

  static removeToken(refreshToken: IRefreshToken) {}
}

export default TokenService;
