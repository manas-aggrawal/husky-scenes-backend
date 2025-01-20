import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsNortheasternEmail } from 'src/common/validators/custom-email.decorator';
import { Role } from 'src/common/enums';

export class RegisterUserDTO {
  @IsString({ message: 'firstName must be a string' })
  public firstName: string;
  @IsString({ message: 'lastName must be a string' })
  @IsOptional()
  public lastName?: string;
  @IsString()
  @IsOptional()
  public nuid?: string;
  @IsEmail()
  @IsNortheasternEmail({
    message:
      'Please use a valid Northeastern email address (@northeastern.edu)',
  })
  public email: string;
  @IsStrongPassword()
  public password: string;
  @IsEnum(Role)
  public role: Role;
}
