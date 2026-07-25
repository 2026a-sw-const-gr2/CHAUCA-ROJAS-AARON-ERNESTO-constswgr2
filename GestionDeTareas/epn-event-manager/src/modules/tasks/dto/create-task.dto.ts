import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsIn(['pendiente', 'en progreso', 'completada']) //Evita que se ingresen estados no válidos
  estado?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsInt()
  projectId?: number;
}
