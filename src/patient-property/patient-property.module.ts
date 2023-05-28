import { Module } from '@nestjs/common';
import { PatientPropertyController } from './patient-property.controller';
import { PatientPropertyService } from './patient-property.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PatientPropertyEntity} from "./entities/patient.property.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PatientPropertyEntity])],
  controllers: [PatientPropertyController],
  providers: [PatientPropertyService]
})
export class PatientPropertyModule {}
