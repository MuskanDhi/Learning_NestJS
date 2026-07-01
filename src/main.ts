import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (THIS FIXES YOUR ERROR)
  app.enableCors({
    origin: true, // or '*' for dev
    credentials: true,
  });

  // Compression middleware
  app.use(compression());

  console.log('APP STARTED');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();