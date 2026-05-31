import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateSmartphoneDto {
  // Antes: sin MaxLength — ahora límites consistentes con CreateSmartphoneDto
  @ApiPropertyOptional({ example: 'Apple', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ example: 'iPhone 15', maxLength: 150 })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  model?: string;

  @ApiPropertyOptional({ example: 999.99, minimum: 0.01 })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  price?: number;

  @ApiPropertyOptional({ example: '256GB', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  storage?: string;
}
