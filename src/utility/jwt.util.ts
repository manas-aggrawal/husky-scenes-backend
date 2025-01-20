import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/common/constants/app.constants';
import { JwtPayload } from './utility.types';
import { InternalServerErrorException } from '@nestjs/common';

export class JwtUtil {
  /**
   * Method to generate jwt token based on user payload.
   * @param payload - the user payload to be binded to jwt.
   * @returns JwtPayload
   */
  static generateToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, JWT_SECRET);
    } catch (err) {
      console.error('Error generating JWT:', err.message);
      throw new InternalServerErrorException('Failed to generate token');
    }
  }
}
