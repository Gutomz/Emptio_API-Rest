import * as jwt from 'jsonwebtoken';
import environment from '../../environment';
import { UnauthorizedError } from '../../errors/Unauthorized.Error';

class AuthService {

  public async generateToken (data: any, options: jwt.SignOptions) {
    return jwt.sign(data, environment.getPrivateKey(), options);
  }

  public async verifyToken (token: string, options: jwt.VerifyOptions) {
    try {
      return jwt.verify(token, environment.getPrivateKey(), options);
    } catch (error) {
      throw new UnauthorizedError();
    }
  }

  public async generateAccessToken (user: any) {
    const data = {
      id: user._id,
    };

    const options = {
      // expiresIn: '7d',
    };

    return this.generateToken(data, options);
  }

  public async generateRefreshToken (user: any) {
    const data = {
      id: user._id,
    };

    const options: jwt.SignOptions = {
      noTimestamp: true,
    };

    return this.generateToken(data, options);
  }

  public async generateKeyPairs (user: any) {
    const keys = {
      token: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };

    return keys;
  }
}

export default new AuthService();
