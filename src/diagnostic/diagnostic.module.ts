import { Module } from '@nestjs/common';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DiagnosticEntity} from "./entities/diagnostic.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagnosticEntity])
  ],
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
  exports: [DiagnosticService]
})
export class DiagnosticModule {}
