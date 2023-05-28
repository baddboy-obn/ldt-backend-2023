import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesEntity} from "./entities/files.entity";
import {ResultEntity} from "./entities/result.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity,ResultEntity])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
