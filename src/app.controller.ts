import {
  Body,
  Controller,
  FileTypeValidator, Get, HttpStatus, Inject,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {AppService} from './app.service';

import {FileExtender} from "./common/FileExtender";
import {diskStorage} from "multer";
import { extname } from  'path';
import {FilesService} from "./files/files.service";
import {CreateInitDto} from "./CreateInitDto";
import {AuditPageResult} from "./ResponseInitDto";
import {initCheckout} from "./index";
import * as path from "path";
import * as process from "process";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Inject()
  fileService: FilesService;

  @Post('/files-upload')
  @ApiOperation({ summary: 'Multiply media upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${process.cwd()}/public`,
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async uploadFiles(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              '(image/jpeg|image/png|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|text/csv)',
          }),
        ],
      }),
    )
      file: Express.Multer.File,
  ) {
    return await this.fileService.setOne({ fileName: file.filename})
  }

  @Post('/initialize')
  @ApiResponse({ status: HttpStatus.OK, type: AuditPageResult })
  async initialize(@Body() data: CreateInitDto): Promise<AuditPageResult|any> {
    const dataSetPath = await this.fileService.getOne(data.fileId)

    const _data = await initCheckout({
      mkbDataPath: `${process.cwd()}/public/compared_result.csv`,
      dataSetPath: `${process.cwd()}/dist/public/`,
      resultCSV: `${process.cwd()}/public/result/${dataSetPath.fileName.split('.')[0]}.csv`,
      resultEXCEL: `${process.cwd()}/public/result/${dataSetPath.fileName.split('.')[0]}.xlsx`,
      // resultJSON: path.resolve(__dirname, `../public/result/${dataSetPath.fileName.split('.')[0]}.pdf`),
      checkoutData: {
        ...data,
        resultDocs: {
          xl_href: `${process.cwd()}/public/result/${dataSetPath.fileName.split('.')[0]}.xlsx`,
          csv_href: `${process.cwd()}/public/result/${dataSetPath.fileName.split('.')[0]}.csv`,
        }
      }
    })
    return await this.fileService.setResult({result: _data})
  }

  @Get('/many/initialize')
  async getManyInit() {
    return await this.fileService.getResult();
  }
}

