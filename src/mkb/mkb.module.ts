import { Module } from '@nestjs/common';
import { MkbController } from './mkb.controller';
import { MkbService } from './mkb.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MkbEntity} from "./entities/mkb.entity";
import {MkbCategoryEntity} from "./entities/mkb.category.entity";
import {MkbCategoryService} from "./mkb.category.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([MkbEntity, MkbCategoryEntity])
  ],
  controllers: [MkbController],
  providers: [MkbService, MkbCategoryService],
  exports: [MkbService, MkbCategoryService]
})
export class MkbModule {}
