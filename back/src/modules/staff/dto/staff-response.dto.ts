import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class StaffResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Уникальный идентификатор сотрудника'
    })
    @Expose()
    id: string

    @ApiProperty({
        example: 'user@example.com',
        description: 'Email сотрудника'
    })
    @Expose()
    email: string

    @Expose()
    avatar: string

    @Expose()
    displayName: string

    @Expose()
    firstName: string
    @Expose()
    midleName: string
    @Expose()
    lastName: string
    @Expose()
    bio: string
    @Expose()
    telegramId: string
    @Expose()
    permissions: string
    @Expose()
    projects: string[]

    @Expose()
    notificationSettings: {
        authLogin: boolean
        passwordReset: boolean
    }
}