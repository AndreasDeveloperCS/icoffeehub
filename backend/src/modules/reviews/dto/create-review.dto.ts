import { IsArray, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];
}
