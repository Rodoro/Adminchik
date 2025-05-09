import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty({ required: false })
    data?: T;
}