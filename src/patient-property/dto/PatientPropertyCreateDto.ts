import {IPatientProperty} from "../interfaces/IPatientProperty";
import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNumber, IsString} from "class-validator";

export class PatientPropertyCreateDto implements Omit<IPatientProperty, 'id'>{
  @ApiProperty()
  @IsString()
  diagnose: string;

  @ApiProperty()
  @IsString()
  diagnosticDate: string;

  @ApiProperty()
  @IsString()
  doctorProfession: string;
}

export class PatientPropertyResponseDto implements IPatientProperty{
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  diagnose: string;

  @ApiProperty()
  @IsString()
  diagnosticDate: string;

  @ApiProperty()
  @IsString()
  doctorProfession: string;
}