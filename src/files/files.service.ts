import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FilesEntity} from "./entities/files.entity";
import {Repository} from "typeorm";
import {CreateFileDto} from "./dto/CreateFileDto";
import {ResultEntity} from "./entities/result.entity";
import {CreateResultDto} from "./dto/CreateResultDto";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
    @InjectRepository(ResultEntity)
    private readonly resultEntityRepository: Repository<ResultEntity>
  ) {

  }

  async setOne(data: CreateFileDto) {
    return await this.filesRepository.save(data)
  }

  async getOne(id: number) {
    const one = await this.filesRepository.findOne({
      where: {
        id
      }
    })

    if(!one) {
      throw new NotFoundException('Not found')
    }
    return one
  }

  async setResult(data: CreateResultDto) {
    return await this.resultEntityRepository.save(data)
  }

  async getResult() {
    return await this.resultEntityRepository.find()
  }
}
