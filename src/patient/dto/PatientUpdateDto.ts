import {IPatient} from "../interfaces/IPatient";
import {TSex} from "../types/TSex";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";

export class PatientUpdateDtoDto implements Omit<IPatient, 'id'>  {
  @ApiPropertyOptional({ type: 'enum', enum: TSex})
  @IsEnum(TSex)
  @IsOptional()
  sex: TSex;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  birth: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  patientId: number
}