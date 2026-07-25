import { IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
