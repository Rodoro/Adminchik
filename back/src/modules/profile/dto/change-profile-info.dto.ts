import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class ChangeProfileInfoDto {
    @ApiProperty({
        example: 'Ivan',
        description: 'User first name (only letters, numbers and hyphens)',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Zа-яА-ЯёЁ0-9]+(?:-[a-zA-Zа-яА-ЯёЁ0-9]+)*$/)
    public firstName: string;

    @ApiProperty({
        example: 'Ivanovich',
        description: 'User middle name (only letters, numbers and hyphens)',
        required: false,
    })
    @IsString()
    @IsOptional()
    public midleName: string;

    @ApiProperty({
        example: 'Ivanov',
        description: 'User last name (only letters, numbers and hyphens)',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Zа-яА-ЯёЁ0-9]+(?:-[a-zA-Zа-яА-ЯёЁ0-9]+)*$/)
    public lastName: string;

    @ApiProperty({
        example: 'Cool User',
        description: 'Display name that will be shown to other users',
    })
    @IsString()
    @IsNotEmpty()
    public displayName: string;

    @ApiPropertyOptional({
        example: 'I love programming!',
        description: 'Short bio (max 300 chars)',
        maxLength: 300,
    })
    @IsString()
    @IsOptional()
    @MaxLength(300)
    public bio?: string;
}