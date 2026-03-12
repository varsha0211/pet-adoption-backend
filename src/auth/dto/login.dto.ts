import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email must ne not empty' })
  email: string;

  @IsNotEmpty({ message: 'Password must be not be empty' })
  password: string;
}
