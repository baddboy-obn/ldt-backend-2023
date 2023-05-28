import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import { MkbModule } from './mkb/mkb.module';
import {MkbEntity} from "./mkb/entities/mkb.entity";
import {MkbCategoryEntity} from "./mkb/entities/mkb.category.entity";
import { PatientModule } from './patient/patient.module';
import {PatientEntity} from "./patient/entities/patient.entity";
import { PatientPropertyModule } from './patient-property/patient-property.module';
import {PatientPropertyEntity} from "./patient-property/entities/patient.property.entity";
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import {DiagnosticEntity} from "./diagnostic/entities/diagnostic.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => ({
          type: 'postgres',
          host: cfg.get('DB_HOST'),
          port: Number(cfg.get('DB_PORT')),
          username: cfg.get('DB_USERNAME'),
          password: cfg.get('DB_PASSWORD'),
          database: cfg.get('DB_DATABASE'),
          synchronize: cfg.get('DB_SYNC') === 'true',
          subscribers: [],
          entities: [
            MkbEntity,
            MkbCategoryEntity,
            PatientPropertyEntity,
            PatientEntity,
            DiagnosticEntity
          ]
        })
      }
    ),
    MkbModule,
    PatientModule,
    PatientPropertyModule,
    DiagnosticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
