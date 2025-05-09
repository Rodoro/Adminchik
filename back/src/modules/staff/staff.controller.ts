import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { DeleteStaffDto } from "./dto/delete-staff.dto";
import { StaffResponseDto } from "./dto/staff-response.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";

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
    async create(@Body() createStaffDto: CreateStaffDto): Promise<{ success: boolean }> {
        await this.staffService.create(createStaffDto);
        return { success: true };
    }

    @Delete()
    @ApiOperation({ summary: 'Delete staff member' })
    @ApiResponse({
        status: 200,
        description: 'Staff member deleted successfully',
    })
    @ApiResponse({ status: 404, description: 'Staff member not found' })
    async delete(@Body() deleteStaffDto: DeleteStaffDto): Promise<{ success: boolean }> {
        await this.staffService.delete(deleteStaffDto);
        return { success: true };
    }
}