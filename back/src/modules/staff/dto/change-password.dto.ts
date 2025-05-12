import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public oldPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public newPassword: string;
}