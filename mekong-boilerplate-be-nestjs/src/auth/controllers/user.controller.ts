import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Controller('users')
@UseGuards(RoleGuard)
@ApiTags('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated users',
    type: Object,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by email or name',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by email',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by name',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filter by role',
  })
  @ApiQuery({
    name: 'createdDateFrom',
    required: false,
    type: String,
    description: 'Filter by created date from (ISO date string)',
  })
  @ApiQuery({
    name: 'createdDateTo',
    required: false,
    type: String,
    description: 'Filter by created date to (ISO date string)',
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    type: String,
    description: 'Sort direction (asc or desc)',
  })
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: any): Promise<PaginatedResult<User>> {
    const paginationQuery = plainToInstance(PaginationQueryDto, query);
    const filterDto = plainToInstance(FilterUserDto, query);

    const errors1 = validateSync(paginationQuery);
    const errors2 = validateSync(filterDto);

    if (errors1.length || errors2.length) {
      throw new BadRequestException([...errors1, ...errors2]);
    }

    return this.authService.findAllUsersPaginated(paginationQuery, filterDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: number): Promise<User> {
    return this.authService.findUserById(id);
  }

  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param('id') id: number,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.authService.updateUserRole(id, role);
  }
}
