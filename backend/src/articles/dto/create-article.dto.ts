import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  @MinLength(10)
  body: string;
}
