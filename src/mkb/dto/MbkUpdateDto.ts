import {IMkb} from "../interfaces/IMkb";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import {TMkb} from "../types/TMkb";

export class MbkUpdateDto implements Omit<IMkb,'id'>{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  del_freq: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mkb_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  use_freq: number;

  @ApiPropertyOptional({ type: 'enum', enum: TMkb })
  @IsOptional()
  @IsEnum(TMkb)
  type: TMkb;

}