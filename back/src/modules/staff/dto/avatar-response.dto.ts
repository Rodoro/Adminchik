import { ApiProperty } from '@nestjs/swagger';

export class AvatarResponseDto {
    @ApiProperty({
        description: 'Avatar file URL',
        example: 'https://example.com/avatars/user123.webp',
    })
    url: string;

    @ApiProperty({
        description: 'Avatar file name',
        example: 'user123.webp',
    })
    filename: string;
}