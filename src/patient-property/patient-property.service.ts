import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PatientPropertyEntity} from "./entities/patient.property.entity";
import {PatientPropertyCreateDto} from "./dto/PatientPropertyCreateDto";
import {PatientPropertyUpdateDto} from "./dto/PatientPropertyUpdateDto";

@Injectable()
export class PatientPropertyService {
  constructor(
    @InjectRepository(PatientPropertyEntity)
    private patientPropertyEntityRepository: Repository<PatientPropertyEntity>
  ) {
  }

  async setOne(data: PatientPropertyCreateDto): Promise<PatientPropertyEntity> {
    return await this.patientPropertyEntityRepository.save(data)
  }
  async setMany(data: PatientPropertyCreateDto[]): Promise<void> {
    await this.patientPropertyEntityRepository.save(data)
  }

  async getMany(): Promise<{ items: PatientPropertyEntity[], count: number }> {
    const [items, count] = await this.patientPropertyEntityRepository.findAndCount()
    return {
      items,
      count
    }
  }

  async getOne(id: number) {
    return await this.patientPropertyEntityRepository.findOne({
      where: {
        id
      }
    })
  }

  async updOne(id, update: PatientPropertyUpdateDto) {
    const found = await this.getOne(id);
    const merged = await this.patientPropertyEntityRepository.merge(found, update);
    return await this.patientPropertyEntityRepository.save(merged)
  }

  async delOne(id: number) {
    const found = await this.getOne(id);
    if(!found) {
      throw new NotFoundException('Is not found')
    }
    await this.patientPropertyEntityRepository.delete(found)
  }
}
