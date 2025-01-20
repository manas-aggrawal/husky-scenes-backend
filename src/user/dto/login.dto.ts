import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsNortheasternEmail } from 'src/common/validators/custom-email.decorator';

export class LoginUserDTO {
  @IsString()
  @IsOptional()
  public nuid?: string;

  @IsEmail()
  @IsOptional()
  @IsNortheasternEmail()
  public email?: string;

  @IsStrongPassword()
  public password: string;
}
