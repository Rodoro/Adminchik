import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteStaffDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email сотрудника для удаления'
    })
    @IsEmail({}, { message: 'Введите корректный email адрес' })
    email: string
}