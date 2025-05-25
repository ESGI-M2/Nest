import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { JwtIoAdapter } from './common/adapters/jwt-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());
  app.useWebSocketAdapter(new JwtIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('5IW2 MyGuez')
    .setDescription('MyGES but guezzier')
    .setVersion('1.0')
    .addTag('MyGuez')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap()
  .then(() => {
    console.log(`Application is running on port: ${process.env.PORT ?? 3000}`);
  })
  .catch((err) => {
    console.error('Error starting the application:', err);
  });
