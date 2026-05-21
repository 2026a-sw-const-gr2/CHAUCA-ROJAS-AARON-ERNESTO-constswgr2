import { IsString, IsObject, IsOptional, IsIn } from 'class-validator';

// Definimos la interfaz del payload 
export interface EventPayload {
  id?: number | string;        
  titulo?: string;             
  descripcion?: string;        
  estado?: string;             
  query_term?: string;         
  [key: string]: unknown;      
}

export class CreateEventDto {
  @IsString()
  source!: string;

  @IsString()
  entity!: string;

  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'QUERY']) // Validación estricta de acciones
  action!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  payload?: EventPayload;
}
