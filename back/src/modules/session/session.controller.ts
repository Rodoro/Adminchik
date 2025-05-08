import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { LoginStaffDto } from './dto/login-staff.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaffResponseDto } from '../staff/dto/staff-response.dto';
import { Request } from 'express';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { ErrorResponseDto } from '@/src/shared/dto/error-response.dto';

@ApiTags('Session')
@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    @Post('login')
    @ApiOperation({ summary: 'Staff login' })
    @ApiBody({ type: LoginStaffDto })
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
        type: StaffResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибки валидации',
        type: ErrorResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Неверные учетные данные',
        type: ErrorResponseDto
    })
    @ApiResponse({ status: 404, description: 'User not found or invalid password' })
    async login(@Req() req: Request, @Body() loginStaffDto: LoginStaffDto) {
        return this.sessionService.login(req, loginStaffDto);
    }

    @Post('logout')
    @Authorization()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Staff logout' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    async logout(@Req() req: Request) {
        return this.sessionService.logout(req);
    }
}