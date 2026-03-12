import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(2, { message: 'First Name must have atleast 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Last Name must have atleast 2 characters.' })
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'Password must include uppercase, lowercase, numbers, and special characters',
    },
  )
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}
