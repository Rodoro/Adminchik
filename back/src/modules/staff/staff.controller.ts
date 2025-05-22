import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { DeleteStaffDto } from "./dto/delete-staff.dto";
import { StaffResponseDto } from "./dto/staff-response.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { Staff } from "@/prisma/generated";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AddPermissionsDto } from "./dto/add-permissions.dto";
import { AddProjectsDto } from "./dto/add-projects.dto";
import { RemovePermissionsDto } from "./dto/remove-permissions.dto";
import { RemoveProjectsDto } from "./dto/remove-projects.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { SuccessResponseDto } from "../profile/dto/success-response.dto";
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe";
import { Readable } from "stream";
import { FileInterceptor } from "@nestjs/platform-express";
import { SessionDto } from "../session/dto/session.dto";
import { Request } from 'express';

@ApiTags('Staff')
@Authorization()
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current staff member' })
    @ApiResponse({
        status: 200,
        description: 'Staff member found',
        type: StaffResponseDto
    })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async me(@Authorized('id') id: string): Promise<StaffResponseDto> {
        return this.staffService.me(id);
    }

    @Get('info/:staffId')
    @ApiOperation({ summary: 'Get current staff member' })
    @ApiResponse({
        status: 200,
        description: 'Staff member found',
        type: StaffResponseDto
    })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async getStaffById(
        @Param('staffId') staffId: string
    ): Promise<StaffResponseDto> {
        return this.staffService.me(staffId);
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all staff members' })
    @ApiResponse({
        status: 200,
        description: 'List of all staff members',
        type: [StaffResponseDto]
    })
    async findAll(): Promise<StaffResponseDto[]> {
        return this.staffService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create new staff member' })
    @ApiResponse({
        status: 201,
        description: 'Staff member created successfully',
    })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async create(@Authorized('id') id: string, @Body() createStaffDto: CreateStaffDto): Promise<{ success: boolean }> {
        await this.staffService.create(id, createStaffDto);
        return { success: true };
    }

    @Delete()
    @ApiOperation({ summary: 'Delete staff member' })
    @ApiResponse({
        status: 200,
        description: 'Staff member deleted successfully',
    })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async delete(@Authorized('id') id: string, @Body() deleteStaffDto: DeleteStaffDto): Promise<{ success: boolean }> {
        await this.staffService.delete(id, deleteStaffDto);
        return { success: true };
    }

    @Post('change-email')
    @ApiOperation({ summary: 'Change user email' })
    @ApiResponse({
        status: 200,
        description: 'Email changed successfully',
        type: Boolean
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async changeEmail(
        @Authorized() user: Staff,
        @Body() input: ChangeEmailDto
    ): Promise<{ success: boolean }> {
        await this.staffService.changeEmail(user, input);
        return { success: true };
    }

    @Post('change-password')
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        type: Boolean
    })
    @ApiResponse({ status: 401, description: 'Unauthorized or wrong old password' })
    async changePassword(
        @Authorized() user: Staff,
        @Body() input: ChangePasswordDto
    ): Promise<{ success: boolean }> {
        await this.staffService.changePassword(user, input);
        return { success: true };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update staff member by ID' })
    @ApiResponse({
        status: 200,
        description: 'Staff member updated successfully',
    })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async update(
        @Authorized('id') requesterId: string,
        @Param('id') staffId: string,
        @Body() updateStaffDto: UpdateStaffDto
    ): Promise<{ success: boolean }> {
        await this.staffService.update(requesterId, staffId, updateStaffDto);
        return { success: true };
    }

    // Методы для работы с правами
    @Post('permissions/add')
    @ApiOperation({ summary: 'Add permissions to staff member' })
    @ApiResponse({
        status: 200,
        description: 'Permissions added successfully',
    })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async addPermissions(
        @Authorized('id') requesterId: string,
        @Body() dto: AddPermissionsDto
    ): Promise<{ success: boolean }> {
        await this.staffService.addPermissions(requesterId, dto);
        return { success: true };
    }

    @Post('permissions/remove')
    @ApiOperation({ summary: 'Remove permissions from staff member' })
    @ApiResponse({
        status: 200,
        description: 'Permissions removed successfully',
    })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async removePermissions(
        @Authorized('id') requesterId: string,
        @Body() dto: RemovePermissionsDto
    ): Promise<{ success: boolean }> {
        await this.staffService.removePermissions(requesterId, dto);
        return { success: true };
    }

    // Методы для работы с проектами
    @Post('projects/add')
    @ApiOperation({ summary: 'Add projects to staff member' })
    @ApiResponse({
        status: 200,
        description: 'Projects added successfully',
    })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async addProjects(
        @Authorized('id') requesterId: string,
        @Body() dto: AddProjectsDto
    ): Promise<{ success: boolean }> {
        await this.staffService.addProjects(requesterId, dto);
        return { success: true };
    }

    @Post('projects/remove')
    @ApiOperation({ summary: 'Remove projects from staff member' })
    @ApiResponse({
        status: 200,
        description: 'Projects removed successfully',
    })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async removeProjects(
        @Authorized('id') requesterId: string,
        @Body() dto: RemoveProjectsDto
    ): Promise<{ success: boolean }> {
        await this.staffService.removeProjects(requesterId, dto);
        return { success: true };
    }

    @Get('projects/:staffId')
    @ApiOperation({ summary: 'Get staff member projects' })
    @ApiResponse({
        status: 200,
        description: 'List of staff member projects',
        type: [String]
    })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async getStaffProjects(
        @Param('staffId') staffId: string
    ): Promise<string[]> {
        return this.staffService.getStaffProjects(staffId);
    }

    @Post('avatar/:id')
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
        @Param('id') userId: string,
        @UploadedFile(FileValidationPipe) avatar: Express.Multer.File,
    ) {
        const result = await this.staffService.changeAvatar(userId, {
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

    @Delete('avatar-del/:id')
    @ApiOperation({ summary: 'Remove profile avatar' })
    @ApiResponse({
        status: 200,
        description: 'Avatar successfully removed',
        type: SuccessResponseDto,
    })
    public async removeAvatar(@Param('id') userId: string) {
        const result = await this.staffService.removeAvatar(userId);
        return {
            success: result,
            message: 'Avatar successfully removed',
        };
    }

    @Authorization()
    @Get('session/:staffId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all sessions for staff member' })
    @ApiResponse({
        status: 200,
        description: 'List of sessions for staff member',
        type: [SessionDto]
    })
    async findByStaff(
        @Req() req: Request,
        @Param('staffId') staffId: string
    ) {
        return this.staffService.findByStaff(req, staffId);
    }

    @Authorization()
    @Delete('session/:staffId/:sessionId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Terminate staff session by ID' })
    @ApiResponse({
        status: 200,
        description: 'Session terminated successfully'
    })
    async removeStaffSession(
        @Req() req: Request,
        @Param('staffId') staffId: string,
        @Param('sessionId') sessionId: string
    ) {
        return this.staffService.removeStaffSession(req, staffId, sessionId);
    }
}