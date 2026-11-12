import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WeekPlanDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  topic: string;

  @IsString()
  @IsIn(['personal', 'company'])
  tone: 'personal' | 'company';

  @IsOptional()
  @IsString()
  @MaxLength(300)
  audience?: string;
}

export class PostVariationsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(5000)
  content: string;
}

class WeekDraftPost {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  @IsDateString()
  date: string;
}

export class CreateWeekDraftsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(14)
  @ValidateNested({ each: true })
  @Type(() => WeekDraftPost)
  @IsDefined()
  posts: WeekDraftPost[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  integrations: string[];
}
