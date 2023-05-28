import {IPatient} from "../interfaces/IPatient";
import {TSex} from "../types/TSex";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsObject, IsString} from "class-validator";
import {
  PatientPropertyCreateDto,
  PatientPropertyResponseDto
} from "../../patient-property/dto/PatientPropertyCreateDto";

export class PatientCreateDto implements Omit<IPatient, 'id'>  {
  @ApiProperty({ type: 'enum', enum: TSex})
  @IsEnum(TSex)
  sex: TSex;

  @ApiProperty()
  @IsString()
  birth: string;

  @ApiProperty()
  @IsNumber()
  patientId: number

  @ApiProperty({ type: () => PatientPropertyCreateDto, isArray: true})
  @IsObject()
  property: PatientPropertyCreateDto[]
}