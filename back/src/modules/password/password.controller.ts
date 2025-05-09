import { Body, Controller, Post, Req } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { NewPasswordDto } from "./dto/new-password.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UserAgent } from "@/src/shared/decorators/user-agent.decorator";

@ApiTags('Password')
@Controller('password')
export class PasswordController {
    constructor(private readonly passwordService: PasswordService) { }

    @Post('reset')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent if user exists',
        type: Boolean
    })
    async resetPassword(
        @Body() input: ResetPasswordDto,
        @UserAgent() userAgent: string,
        @Req() req: Request
    ) {
        return this.passwordService.resetPassword(req, input, userAgent);
    }

    @Post('new')
    @ApiOperation({ summary: 'Set new password with reset token' })
    @ApiResponse({
        status: 200,
        description: 'Password successfully changed',
        type: Boolean
    })
    @ApiResponse({ status: 404, description: 'Token not found' })
    @ApiResponse({ status: 400, description: 'Token expired' })
    async newPassword(@Body() input: NewPasswordDto) {
        return this.passwordService.newPassword(input);
    }
}