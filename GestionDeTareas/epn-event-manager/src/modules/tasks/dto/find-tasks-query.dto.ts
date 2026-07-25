import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindTasksQueryDto {
  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;

  @IsOptional()
  @IsIn(['pendiente', 'en progreso', 'completada'])
  estado?: string;
}
