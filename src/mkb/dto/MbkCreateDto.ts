import {IMkb} from "../interfaces/IMkb";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsString} from 'class-validator';
import {TMkb} from "../types/TMkb";

export class MbkCreateDto implements Omit<IMkb,'id'>{
  @ApiProperty()
  @IsNumber()
  del_freq: number;

  @ApiProperty()
  @IsString()
  mkb_code: string;

  @ApiProperty()
  @IsString()
  recommendation: string;

  @ApiProperty()
  @IsNumber()
  use_freq: number;

  @ApiProperty({ type: 'enum', enum: TMkb })
  @IsEnum(TMkb)
  type: TMkb;

}