import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateStaffDto {
    @ApiProperty({
        example: 'daniil.213411@gmail.com',
        description: 'Email нового сотрудника'
    })
    @IsEmail({}, { message: 'Введите корректный email адрес' })
    email: string

    @ApiProperty({
        example: 'Rodoro',
        description: 'Пароль нового сотрудника (минимум 6 символов)'
    })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string

    @ApiProperty({
        example: 'Rodoro',
    })
    @IsString({ message: 'Отоброжаемое имя должно быть строкой' })
    displayName: string

    @ApiProperty({
        example: 'Rodoro',
    })
    @IsString({ message: 'FirstName должен быть строкой' })
    firstName: string

    @ApiProperty({
        example: 'Rodoro',
    })
    @IsString({ message: 'LastName должен быть строкой' })
    lastName: string
}