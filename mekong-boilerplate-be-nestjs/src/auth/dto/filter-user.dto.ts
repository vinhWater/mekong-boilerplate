import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class FilterUserDto {
  @ApiPropertyOptional({
    description: 'Search by email or name',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Filter by created date from (ISO date string)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  createdDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by created date to (ISO date string)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  createdDateTo?: string;
}
