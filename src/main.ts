import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {Logger, ValidationPipe} from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, new DocumentBuilder().setTitle(process.env.APP_NAME).addBearerAuth().build()),
    {
      swaggerOptions: {
        defaultModelRendering: 'model',
        defaultModelExpandDepth: 4,
      },
    },
  );
  app.useStaticAssets(join(__dirname, '..','public'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: true
  });

  await app.listen(config.get('APP_PORT'))
}
bootstrap().then(() => {
  logger.log(`http://${process.env.APP_HOST}:${process.env.APP_PORT}/docs`)
});
