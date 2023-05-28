import {IDiagnostic} from "../interfaces/IDiagnostic";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class DiagnosticCreateDto implements Omit<IDiagnostic,'id'> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mkbCode: string;
}

export class DiagnosticUpdateDto implements Omit<IDiagnostic,'id'> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mkbCode: string;
}