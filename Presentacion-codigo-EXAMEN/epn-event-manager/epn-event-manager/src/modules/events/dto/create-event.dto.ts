import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EventAction } from '../../../database/entities/event.entity';

export class CreateEventDto {
  // Antes: sin MaxLength — ahora límites para prevenir payloads excesivamente largos
  @ApiProperty({ example: 'epn-event-manager', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  source!: string;

  @ApiProperty({ example: 'smartphone', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  entity!: string;

  @ApiProperty({ enum: EventAction })
  @IsEnum(EventAction)
  action!: EventAction;

  @ApiProperty({ example: 'Smartphone creado', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Descripción del evento', maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: { id: 1 } })
  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
