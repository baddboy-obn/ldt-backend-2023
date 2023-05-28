import {ApiProperty} from "@nestjs/swagger";
import {IsJSON, IsObject} from "class-validator";

export class CreateResultDto {
  @ApiProperty({ type: 'json'})
  @IsJSON()
  result: any;
}