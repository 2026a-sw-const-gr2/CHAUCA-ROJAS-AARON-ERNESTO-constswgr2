import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsIn(['pendiente', 'en progreso', 'completada']) //Evita que se ingresen estados no válidos
  estado?: string;
}
