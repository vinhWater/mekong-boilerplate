import { IsOptional, IsPositive, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum for sorting direction
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Enum for sorting field
 */
export enum SortField {
  ID = 'id',
  TITLE = 'title',
  NAME = 'name',
  EMAIL = 'email',
  ROLE = 'role',
  BALANCE = 'balance',
  CREATED_AT = 'createdAt',
  CREATE_TIME_TT = 'createTimeTT',
  UPDATED_AT = 'updatedAt',
  EXTRACTED_AT = 'extractedAt',
  MARKETPLACE = 'marketplace',
  SELLER_NAME = 'sellerName',
  REVIEW_COUNT = 'reviewCount',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Number of items per page', default: 20 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: SortField,
    default: SortField.UPDATED_AT,
    example: SortField.UPDATED_AT,
  })
  @IsOptional()
  @IsEnum(SortField)
  sortField?: SortField = SortField.UPDATED_AT;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortDirection,
    default: SortDirection.DESC,
    example: SortDirection.DESC,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC;

  /**
   * Calculate the skip value for TypeORM queries based on page and limit
   */
  getSkip(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }

  /**
   * Get the current page number
   */
  getCurrentPage(): number {
    return this.page || 1;
  }
}
