import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'User email for password reset',
        example: 'user@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}