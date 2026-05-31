import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Antes: sin shutdown hooks — ahora maneja SIGTERM/SIGINT limpiamente al desplegar
  app.enableShutdownHooks();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  // Antes: sin documentación de API — ahora Swagger disponible en /api
  const config = new DocumentBuilder()
    .setTitle('EPN Event Manager API')
    .setDescription('API CRUD de smartphones con registro de eventos')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-fis-epn-key', in: 'header' },
      'x-fis-epn-key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
