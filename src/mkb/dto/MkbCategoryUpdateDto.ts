import {IMkbCategory} from "../interfaces/IMkbCategory";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class MkbCategoryUpdateDto implements Omit<IMkbCategory, 'id'> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mkbCode: string;
}