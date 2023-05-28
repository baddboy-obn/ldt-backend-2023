import {Body, Controller, Inject, Injectable, Post} from '@nestjs/common';
import {FilesService} from "./files.service";
import {CreateFileDto} from "./dto/CreateFileDto";

@Controller('files')
export class FilesController {
  @Inject()
  private readonly filesService: FilesService;

  @Post('/')
  async setOne(@Body() data: CreateFileDto) {
    return await this.filesService.setOne(data)
  }
}
