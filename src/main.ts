import { ConsoleLogger, Logger, RequestMethod, ValidationPipe, } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { EnvsConfig } from "./config/env.config";

const logger = new Logger('Gateway Service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Huahuacuna',
    }),
  });

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Gateway Service')
    .setDescription('API documentation for the Gateway Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory());
  logger.log('Swagger documentation available at /api/docs');

  await app.listen(EnvsConfig.PORT);
  logger.log(`Gateway service is running on port ${EnvsConfig.PORT}`);
}

bootstrap().catch((err) => {
  logger.error('Error during application bootstrap:', err);
  process.exit(1);
});
