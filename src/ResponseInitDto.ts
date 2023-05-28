import {AuditType, CheckoutStatus, TAppointsResult} from "./types/default";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsObject, IsString} from "class-validator";

type TAllStats = {
  green: number
  warning: number
  error: number
  unchecked: number
  cardsCount: number
}

type TResultDocs = {
  xl_href: string
  csv_href: string
  pdf_report: string
}
export class AuditPageResult {

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  num: number

  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty({ type: "enum", enum: AuditType})
  @IsEnum(AuditType)
  type: AuditType

  @ApiProperty({ type: "enum", enum: CheckoutStatus})
  @IsEnum(CheckoutStatus)
  status: CheckoutStatus

  @ApiProperty()
  @IsString()
  dateStart: string

  @ApiProperty()
  @IsString()
  dateEnd: string

  @ApiProperty({ type: "json", isArray: true})
  @IsObject()
  responsible: any

  @ApiProperty()
  @IsString()
  auditReason: string

  @ApiProperty({ type: "json", isArray: true})
  @IsObject()
  result: TAppointsResult[]

  @ApiProperty({ type: "json"})
  @IsObject()
  allStats: TAllStats

  @ApiProperty({ type: "json"})
  @IsObject()
  resultDocs: TResultDocs
}