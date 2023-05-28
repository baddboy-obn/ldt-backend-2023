import {IMkbCategory} from "../interfaces/IMkbCategory";
import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class MkbCategoryCreateDto implements Omit<IMkbCategory, 'id'> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  mkbCode: string;
}