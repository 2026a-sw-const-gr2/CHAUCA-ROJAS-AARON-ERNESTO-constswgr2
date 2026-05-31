import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateSmartphoneDto {
  // Antes: sin MaxLength — ahora límite 100 chars para prevenir entradas maliciosas
  @ApiProperty({ example: 'Samsung', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  brand!: string;

  // Antes: sin MaxLength — ahora límite 150 chars
  @ApiProperty({ example: 'Galaxy S24', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  model!: string;

  // Antes: @Min solo validado en service — ahora también validado en el DTO
  @ApiProperty({ example: 799.99, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  price!: number;

  // Antes: sin MaxLength — ahora límite 50 chars
  @ApiProperty({ example: '128GB', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  storage!: string;
}
