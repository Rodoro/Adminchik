import { IsPasswordMatchingConstraint } from "@/src/shared/decorators/is-password-matching-constait.decorator";
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NewPasswordDto {
    @ApiProperty({
        description: 'New password (min 8 characters)',
        example: 'newSecurePassword123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string;

    @ApiProperty({
        description: 'Repeat new password (must match password)',
        example: 'newSecurePassword123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Validate(IsPasswordMatchingConstraint)
    public passwordRepeat: string;

    @ApiProperty({
        description: 'Password reset token (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID('4')
    @IsNotEmpty()
    public token: string;
}