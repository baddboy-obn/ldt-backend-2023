import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query} from '@nestjs/common';
import {MkbService} from "./mkb.service";
import {IMkb} from "./interfaces/IMkb";
import {MbkCreateDto} from "./dto/MbkCreateDto";
import {MbkUpdateDto} from "./dto/MbkUpdateDto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Справочник МБК-10')
@Controller('mkb')
export class MkbController {
  @Inject()
  private readonly mbkService: MkbService;

  @Get('/one/:id')
  async getOne(@Param('id') id: IMkb['id']) {
    return await this.mbkService.getOne(id);
  }

  @Get('/many')
  async getMany(@Query('take') take: number, @Query('skip') skip: number) {
    return await this.mbkService.getMany({take, skip});
  }

  @Post('/')
  async setOne(@Body() data: MbkCreateDto) {
    return await this.mbkService.setOne(data)
  }

  @Patch('/:id')
  async updOne(@Param('id') id: IMkb['id'], @Body() data: MbkUpdateDto) {
    return await this.mbkService.updOne(id, data)
  }

  @Delete('/:id')
  async delOne(@Param('id') id: IMkb['id']) {
    await this.mbkService.delOne(id)
  }
}
