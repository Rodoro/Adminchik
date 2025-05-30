import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStaffDto {
    @ApiProperty({
        example: 'Rodoro',
        description: 'Отображаемое имя сотрудника'
    })
    @IsString({ message: 'Отоброжаемое имя должно быть строкой' })
    displayName: string;

    @ApiProperty({
        example: 'danya213411@gmail.com',
        description: 'Email сотрудника'
    })
    @IsEmail({}, { message: 'Введите корректный email адрес' })
    email: string;

    @ApiProperty({
        example: 'Даниил',
        description: 'Имя сотрудника'
    })
    @IsString({ message: 'FirstName должен быть строкой' })
    firstName: string;

    @ApiProperty({
        example: 'Шумейко',
        description: 'Фамилия сотрудника'
    })
    @IsString({ message: 'LastName должен быть строкой' })
    lastName: string;

    @ApiProperty({
        example: 'Дмитриевич',
        description: 'Отчество сотрудника',
        required: false
    })
    @IsString({ message: 'Отчество должно быть строкой' })
    @IsOptional()
    midleName?: string;

    @ApiProperty({
        example: 'Опытный разработчик с 5-летним стажем',
        description: 'Биография сотрудника',
        required: false
    })
    @IsString({ message: 'Биография должна быть строкой' })
    @IsOptional()
    bio?: string;

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Массив прав доступа',
    })
    @IsArray({ message: 'Права доступа должны быть массивом чисел' })
    permissions: number[];

    @ApiProperty({
        example: ['Проект1', 'Проект2'],
        description: 'Массив проектов администратора',
    })
    @IsArray({ message: 'Права доступа должны быть массивом Строк' })
    projects: string[]
}