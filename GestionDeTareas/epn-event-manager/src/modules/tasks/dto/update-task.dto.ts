import {
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  @MinLength(3)
  @MaxLength(150)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @IsIn(['pendiente', 'en progreso', 'completada']) //Evita que se ingresen estados no válidos
  estado?: string;

  @IsOptional()
  @IsString()
  responsable?: string;
}
