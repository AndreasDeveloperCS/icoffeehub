import { IsArray, IsOptional, IsString, Max, Min } from 'class-validator';
import { RoastLevel } from '../../catalog/enums/coffee.enums';

export class TasteQuizDto {
  @IsOptional()
  @IsArray()
  preferredRoastLevels?: RoastLevel[];

  @IsOptional()
  @IsArray()
  preferredFlavorNotes?: string[];

  @IsOptional()
  @Min(1)
  @Max(5)
  acidityPreference?: number;

  @IsOptional()
  @Min(1)
  @Max(5)
  bodyPreference?: number;

  @IsOptional()
  @IsArray()
  avoidFlavorNotes?: string[];

  @IsOptional()
  @IsString()
  brewMethod?: string;
}
