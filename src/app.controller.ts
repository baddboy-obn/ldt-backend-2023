import {
  Controller,
  FileTypeValidator,
  Get,
  Inject, Param,
  ParseFilePipe,
  Post, Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiOperation} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {AppService} from './app.service';

import * as XLSX from 'xlsx';
import {FileExtender} from "./common/FileExtender";
import * as iconv from 'iconv-lite';
import {MkbService} from "./mkb/mkb.service";
import * as _ from 'lodash';
import {MkbCategoryService} from "./mkb/mkb.category.service";
import {PatientService} from "./patient/patient.service";
import {TSex} from "./patient/types/TSex";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }
  @Inject()
  private readonly mbkService: MkbService;

  @Inject()
  private readonly mkbCategoryService: MkbCategoryService;

  @Inject()
  private readonly patientService: PatientService;

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
  @UseInterceptors(FileInterceptor('file'))
  uploadFiles(
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
    const content =  this.parserFromBuffer(file.buffer)
    return this.convertToJSON(content);
  }

  @Get('/excel')
  async readExcel() {
    const content = this.parserFromFile(`${process.cwd()}/src/files/dataset.xlsx`)

    return this.convertToJSON(content);
  }

  @Get('/many')
  async getMany(@Query('take') take: number, @Query('skip') skip: number) {
    return await this.patientService.getMany({ take, skip })
  }

  @Get('/by-patient-inner-id/:id')
  async getByPatientId(@Param('id') id: number) {
    return await this.patientService.getOne(id)
  }

  @Get('/by-patient-external-id/:id')
  async getByPatientExternalId(@Param('id') id: number) {
    return await this.patientService.getOneExternal(id)
  }

  private parserFromFile(filename) {
    const excelFile = XLSX.readFile(filename);
    return Object.keys(excelFile.Sheets).map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(excelFile.Sheets[name])
    }))
  }

  private parserFromBuffer(filename) {
    const excelFile = XLSX.read(filename);
    return Object.keys(excelFile.Sheets).map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(excelFile.Sheets[name])
    }))
  }

  private async convertToJSON(content) {
    const result = [];
    let i = 0;
    for(let items of content[0]['data']) {
      // console.log(items)
      const res = {}
      Object.keys(items).map(item => {
        if(item == 'recommendation') {
          items[item] = iconv.decode(items[item], 'utf8').toString()
        }

        if(item == 'NAME') {
          if(typeof items[item] == 'string') {
            items[item] = iconv.decode(items[item], 'utf8').toString()
          }
        }

        if(item == 'CODE') {
          if(typeof items[item] == 'string') {
            items[item] = iconv.decode(items[item], 'utf8').toString()
          }
        }

        Object.assign(res, {
          [item]: items[item]
        })

      })

      // console.log(res)

      // if(res['use_freq'] && res['del_freq'] && typeof res['del_freq'] !== 'string') {
      //   await this.mbkService.setOne(res as MbkCreateDto)
      // }
      const _res = {
        patientId: res['ID пациента'] ,
        mkbCode: res['Код МКБ-10'],
        birth: res['Дата рождения пациента'],
        sex: res['Пол пациента'],
        doctorProfession: res['Должность'],
        diagnose: res['Диагноз'],
        diagnosticDate: res['Дата оказания услуги'],
        diagnostic: res['Назначения'].split('\r\n').filter(item => item.length > 0)
      }

      // const code = {
      //   nkbCode: res['CODE'],
      //   name: res['NAME']
      // }
      //
      // await this.mkbCategoryService.setOne(code)


      result.push(_res)

      i++;
    }
    // console.log(result)
    const r = _.groupBy(result, 'patientId')
    // console.log(r)
    // await this.patientService.

    Object.keys(r).map(async item => {
      const patientProperty = r[item].map(prop => {
        const diagnostic = prop.diagnostic.map(diag => {
          return {
            name: diag,
            mkbCode: null
          }
        })
        return {
          diagnose: prop.diagnose,
          diagnosticDate: prop.diagnosticDate,
          doctorProfession: prop.doctorProfession,
          diagnostic
        }
      })
      // console.log(item)
      await this.patientService.setOne({
        sex: r[item][0].sex == 'Муж' ? TSex.male : TSex.female ,
        patientId: r[item][0].patientId,
        birth: r[item][0].birth,
        property: patientProperty
      })
    })

    // Object.keys(r).map(async item => {
    //   console.log(r[item])
    //   for( let _item of r[item]) {
    //     await this.mkbCategoryService.setOne(_i)
    //   }
    // })

    return r;
  }
}

