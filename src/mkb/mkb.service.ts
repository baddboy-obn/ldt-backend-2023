import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";



import {MkbEntity} from "./entities/mkb.entity";
import {Repository} from "typeorm";
import {MbkCreateDto} from "./dto/MbkCreateDto";
import {MbkUpdateDto} from "./dto/MbkUpdateDto";
import {raw} from "express";

@Injectable()
export class MkbService {
  constructor(
    @InjectRepository(MkbEntity)
    private mkbRepository: Repository<MkbEntity>
  ) {
  }

  async setOne(data: MbkCreateDto): Promise<MkbEntity> {
    return await this.mkbRepository.save(data)
  }
  async setMany(data: MbkCreateDto[]): Promise<void> {
    await this.mkbRepository.save(data)
  }

  async getMany({take,skip}): Promise<{ items: MkbEntity[], count: number }> {
    const [items, count] = await this.mkbRepository.findAndCount({
      take,
      skip
    })
    return {
      items,
      count
    }
  }

  async getOne(id: number) {
    return await this.mkbRepository.findOne({
      where: {
        id
      }
    })
  }

  async updOne(id, update: MbkUpdateDto) {
    const found = await this.getOne(id);
    const merged = await this.mkbRepository.merge(found, update);
    return await this.mkbRepository.save(merged)
  }

  async delOne(id: number) {
    const found = await this.getOne(id);
    if(!found) {
      throw new NotFoundException('Is not found')
    }
    await this.mkbRepository.delete(found)
  }


}
