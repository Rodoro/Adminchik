import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateStaffDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email нового сотрудника'
    })
    @IsEmail({}, { message: 'Введите корректный email адрес' })
    email: string

    @ApiProperty({
        example: 'securePassword123',
        description: 'Пароль нового сотрудника (минимум 6 символов)'
    })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string
}