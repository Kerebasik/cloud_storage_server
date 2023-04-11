import { describe } from 'mocha';
import { assert } from 'chai';
import SHA256 from 'crypto-js/sha256';
import { PassValid } from '../../services/authService';
import TokenService from '../../services/tokenService';
import { TDecode } from '../../middleware/authMiddleware';
import jwt from 'jsonwebtoken';

const hashPasswordFromDB = String(SHA256('password'));

describe('Tests AuthService', () => {
  describe('PassValid', () => {
    it('Password is valid', () => {
      const passwordFromClient = 'password';
      const result = PassValid(passwordFromClient, hashPasswordFromDB);
      assert.equal(result, true);
    });

    it('Password is not valid', () => {
      const passwordFromClient = 'word';
      const result = PassValid(passwordFromClient, hashPasswordFromDB);
      assert.equal(result, false);
    });

    it('Different registers', () => {
      const passwordFromClient = 'Password';
      const result = PassValid(passwordFromClient, hashPasswordFromDB);
      assert.equal(result, false);
    });
  });

  describe('validateTokens', () => {
    const testObject = {
      _id: '000000',
    };
    it('validateAccessToken', () => {
      const tokens = TokenService.generateTokens(testObject);
      const dataFromAccessToken = TokenService.validateAccessToken(
        tokens.accessToken,
      ) as TDecode;
      assert.equal(dataFromAccessToken._id, testObject._id);
    });

    it('validateRefreshToken ', () => {
      const tokens = TokenService.generateTokens(testObject);
      const dataFromAccessToken = TokenService.validateAccessToken(
        tokens.accessToken,
      ) as TDecode;
      assert.equal(dataFromAccessToken._id, testObject._id);
    });
  });
  describe('generateTokens', () => {
    const testObject = {
      _id: '000010',
      name: 'John Sins',
    };
    type TestObject = {
      _id: string;
      name: string;
    };

    type TJwtVerify = TestObject & {
      iat: number;
      exp: number;
    };

    it('right generate tokens', () => {
      const tokens = TokenService.generateTokens(testObject);
      const dataFromAccessToken = jwt.verify(
        tokens.accessToken,
        String(process.env.ACCESS_TOKEN_SECRET_KEY),
      ) as TJwtVerify;
      const dataFromRefreshToken = jwt.verify(
        tokens.refreshToken,
        String(process.env.REFRESH_TOKEN_SECRET_KEY),
      ) as TJwtVerify;
      assert.equal(dataFromAccessToken._id, testObject._id);
      assert.equal(dataFromAccessToken.name, testObject.name);
      assert.equal(dataFromRefreshToken._id, testObject._id);
      assert.equal(dataFromRefreshToken.name, testObject.name);
    });
  });
});
