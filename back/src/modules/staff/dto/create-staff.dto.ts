import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator'
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
        description: 'Отображаемое имя сотрудника'
    })
    @IsString({ message: 'Отоброжаемое имя должно быть строкой' })
    displayName: string

    @ApiProperty({
        example: 'Иван',
        description: 'Имя сотрудника'
    })
    @IsString({ message: 'FirstName должен быть строкой' })
    firstName: string

    @ApiProperty({
        example: 'Иванов',
        description: 'Фамилия сотрудника'
    })
    @IsString({ message: 'LastName должен быть строкой' })
    lastName: string

    @ApiProperty({
        example: 'Иванович',
        description: 'Отчество сотрудника (необязательно)',
        required: false
    })
    @IsString({ message: 'Отчество должно быть строкой' })
    @IsOptional()
    midleName?: string

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Массив прав доступа (необязательно)',
        required: false
    })
    @IsArray({ message: 'Права доступа должны быть массивом чисел' })
    @IsOptional()
    permissions?: number[]
}