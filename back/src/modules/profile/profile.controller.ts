// src/profile/profile.controller.ts
import {
    Controller,
    Post,
    Delete,
    UploadedFile,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { SuccessResponseDto } from './dto/success-response.dto';
import { Staff } from '@/prisma/generated';
import { Readable } from 'stream';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';

@ApiTags('Profile')
@Controller('profile')
@Authorization()
@ApiBearerAuth()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Change profile avatar' })
    @ApiBody({
        description: 'Avatar image file',
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Avatar successfully changed',
        type: SuccessResponseDto,
    })
    public async changeAvatar(
        @Req() req: { user: Staff },
        @UploadedFile(FileValidationPipe) avatar: Express.Multer.File,
    ) {
        const result = await this.profileService.changeAvatar(req.user, {
            filename: avatar.originalname,
            mimetype: avatar.mimetype,
            encoding: '7bit',
            createReadStream: () => {
                const readable = new Readable();
                readable.push(avatar.buffer);
                readable.push(null);
                return readable;
            },
        });

        return {
            success: result,
            message: 'Avatar successfully changed',
        };
    }

    @Delete('avatar')
    @ApiOperation({ summary: 'Remove profile avatar' })
    @ApiResponse({
        status: 200,
        description: 'Avatar successfully removed',
        type: SuccessResponseDto,
    })
    public async removeAvatar(@Req() req: { user: Staff }) {
        const result = await this.profileService.removeAvatar(req.user);
        return {
            success: result,
            message: 'Avatar successfully removed',
        };
    }
}