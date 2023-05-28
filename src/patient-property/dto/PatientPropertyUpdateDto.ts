import {IPatientProperty} from "../interfaces/IPatientProperty";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDate, IsOptional, IsString} from "class-validator";

export class PatientPropertyUpdateDto implements Omit<IPatientProperty, 'id'>{
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnose: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnosticDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  doctorProfession: string;
}