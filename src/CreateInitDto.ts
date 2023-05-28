import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsObject, IsString} from "class-validator";

export class ResponsibleDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsString()
  patronymic: string

  @ApiProperty()
  @IsString()
  role: string
}
export class CreateInitDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  type: string

  @ApiProperty()
  @IsString()
  status: string

  @ApiProperty()
  @IsString()
  dateStart: string

  @ApiProperty()
  @IsString()
  dateEnd: string

  @ApiProperty({ type: () => ResponsibleDto })
  @IsObject()
  responsible: ResponsibleDto

  @ApiProperty()
  @IsString()
  auditReason: string;

  @ApiProperty()
  @IsNumber()
  fileId: number
}

