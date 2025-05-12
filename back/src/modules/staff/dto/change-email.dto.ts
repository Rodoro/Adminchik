import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}
