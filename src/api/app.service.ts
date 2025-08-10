import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.enableCors({
      origin: '*',
      credentials: true,
    });

    app.use(cookieParser());

    app.use(['/docs', '/docs-json'], (req, res, next) => {
      if (req.cookies['auth'] === '1') {
        return next();
      }

      return basicAuth({
        users: { admin: '1234' },
        challenge: true,
        unauthorizedResponse: () => 'Unauthorized',
      })(req, res, () => {
        res.cookie('auth', '1', { maxAge: 3600000 });
        next();
      });
    });

    const config = new DocumentBuilder()
      .setTitle('Nasiya app')
      .setDescription('The Nasiya API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer', ['bearer'])
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/file/',
    });

    await app.listen(process.env.PORT ?? 3000);
  }
}
