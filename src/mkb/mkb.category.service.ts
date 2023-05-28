import {InjectRepository} from "@nestjs/typeorm";
import {MkbEntity} from "./entities/mkb.entity";
import {Repository} from "typeorm";
import {MkbCategoryEntity} from "./entities/mkb.category.entity";
import {MkbCategoryCreateDto} from "./dto/MkbCategoryCreateDto";

export class MkbCategoryService {
  constructor(
    @InjectRepository(MkbCategoryEntity)
    private mkbCategoryEntityRepository: Repository<MkbCategoryEntity>
  ) {
  }

  async setOne(data: MkbCategoryCreateDto): Promise<MkbCategoryEntity> {
    return await this.mkbCategoryEntityRepository.save(data)
  }
}