import {IFiles} from "../interfaces/IFiles";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class CreateFileDto implements Omit<IFiles, 'id'| 'createAt' | 'updateAt'> {
  @ApiProperty()
  @IsString()
  fileName: string;

}

export class UpdateFileDto implements Omit<IFiles, 'id'| 'createAt' | 'updateAt'> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileName: string;

}