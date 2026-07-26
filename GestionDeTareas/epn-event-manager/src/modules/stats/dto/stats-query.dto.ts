import { IsOptional, IsString } from 'class-validator';

export class StatsQueryDto {
  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;
}
