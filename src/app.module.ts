import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import { FilesModule } from './files/files.module';
import {FilesEntity} from "./files/entities/files.entity";
import {ResultEntity} from "./files/entities/result.entity";
import { ShopModule } from './shop/shop.module';

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
            FilesEntity,
            ResultEntity
          ]
        })
      }
    ),
    FilesModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
