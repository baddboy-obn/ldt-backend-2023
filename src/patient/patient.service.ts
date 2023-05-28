import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MkbEntity} from "../mkb/entities/mkb.entity";
import {Repository} from "typeorm";
import {MbkCreateDto} from "../mkb/dto/MbkCreateDto";
import {MbkUpdateDto} from "../mkb/dto/MbkUpdateDto";
import {PatientEntity} from "./entities/patient.entity";
import {PatientCreateDto} from "./dto/PatientCreateDto";
import {PatientUpdateDtoDto} from "./dto/PatientUpdateDto";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientEntityRepository: Repository<PatientEntity>
  ) {
  }

  async setOne(data: PatientCreateDto): Promise<PatientEntity> {
    return await this.patientEntityRepository.save(data)
  }
  async setMany(data: PatientCreateDto[]): Promise<void> {
    await this.patientEntityRepository.save(data)
  }

  async getMany({ take, skip }): Promise<{ items: PatientEntity[], count: number }> {
    const [items, count] = await this.patientEntityRepository.findAndCount({
      relations: ['property','property.diagnostic'],
      take,
      skip
    })
    return {
      items,
      count
    }
  }

  async getOne(id: number) {
    return await this.patientEntityRepository.findOne({
      where: {
        id
      }, relations: ['property','property.diagnostic']
    })
  }

  async getOneExternal(id: number) {
    return await this.patientEntityRepository.findOne({
      where: {
        patientId: id
      }, relations: ['property','property.diagnostic']
    })
  }

  async updOne(id, update: PatientUpdateDtoDto) {
    const found = await this.getOne(id);
    const merged = await this.patientEntityRepository.merge(found, update);
    return await this.patientEntityRepository.save(merged)
  }

  async delOne(id: number) {
    const found = await this.getOne(id);
    if(!found) {
      throw new NotFoundException('Is not found')
    }
    await this.patientEntityRepository.delete(found)
  }
}
