import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants/app.constants';
import { SafeUser } from './types/user.type';
import { JwtUtil } from 'src/utility/jwt.util';
import { JwtPayload } from 'src/utility/utility.types';
import { LoginUserDTO } from './dto/login.dto';
import { Role } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Method to hash a plain text password
   * @param password - the password to be hashed
   * @returns string
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS)); // Generate a salt
    return bcrypt.hash(password, salt); // Hash the password with the salt
  }

  /**
   * Registers a new user and generates a jwt token as well.
   * @param user - contains user request body.
   * @returns SafeUser
   */
  public async register(user: RegisterUserDTO): Promise<SafeUser> {
    const { firstName, lastName, password, nuid, role, email } = user;
    console.log('🚀 ~ UserService ~ register ~ user:', user);

    const hashedPwd = await this.hashPassword(password);

    const createdUser = await this.userModel.create({
      firstName,
      lastName: lastName ?? '',
      password: hashedPwd,
      nuid,
      role,
      approved: role === Role.USER ? true : false,
      email,
    });
    console.log('🚀 ~ UserService ~ register ~ createdUser:', createdUser);

    const jwtPayload: JwtPayload = {
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      sub: createdUser._id as string,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
    const token = JwtUtil.generateToken(jwtPayload);

    return {
      id: createdUser._id as string,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      nuid: createdUser.nuid,
      role: createdUser.role,
      token,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  /**
   * Method for user login
   * @param user - user body to login
   * @returns SafeUser
   */
  public async login(user: LoginUserDTO): Promise<SafeUser> {
    const { email, nuid, password } = user;
    const query: any = {};
    if (email) {
      query.email = email;
    } else {
      query.nuid = nuid;
    }

    const loggedInUser: User = await this.userModel.findOne(query);

    if (!loggedInUser) {
      throw new NotFoundException('User not found!');
    }
    if (!(await bcrypt.compare(password, loggedInUser.password))) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const jwtPayload: JwtPayload = {
      role: loggedInUser.role,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      sub: loggedInUser._id as string,
      createdAt: loggedInUser.createdAt,
      updatedAt: loggedInUser.updatedAt,
    };

    const token = JwtUtil.generateToken(jwtPayload);
    return {
      id: loggedInUser._id as string,
      nuid: loggedInUser.nuid,
      email: loggedInUser.email,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      role: loggedInUser.role,
      token,
      createdAt: loggedInUser.createdAt,
      updatedAt: loggedInUser.updatedAt,
    };
  }
}
