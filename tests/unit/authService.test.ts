import { describe } from 'mocha';
import { assert } from 'chai';
import SHA256 from 'crypto-js/sha256';
import { PassValid } from '../../src/services/authService';

const hashPasswordFromDB = String(SHA256('password'))

describe('Tests AuthService', () => {
  describe('PassValid',()=>{
    it('Password is valid', () => {
      const passwordFromClient = 'password'
      const result = PassValid(passwordFromClient, hashPasswordFromDB)
      assert.equal(result, true);
    });

    it('Password is not valid', ()=>{
      const passwordFromClient = 'word'
      const result = PassValid(passwordFromClient, hashPasswordFromDB)
      assert.equal(result, false);
    })

    it('Different registers', ()=>{
      const passwordFromClient = 'Password'
      const result = PassValid(passwordFromClient, hashPasswordFromDB)
      assert.equal(result, false);
    })
  })
});
