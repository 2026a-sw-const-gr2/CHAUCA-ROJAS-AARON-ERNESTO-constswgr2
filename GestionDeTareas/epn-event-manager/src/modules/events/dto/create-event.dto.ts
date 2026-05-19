import { IsString, IsObject, IsOptional, IsIn } from 'class-validator';

export class CreateEventDto {
  @IsString()
  source!: string;

  @IsString()
  entity!: string;

  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'QUERY'])
  action!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
