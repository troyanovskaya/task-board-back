import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as firebaseAdmin from 'firebase-admin';
import { getDatabase } from "firebase/database";
import * as fs from 'fs';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { initializeApp } from "firebase/app";

const server = express();

async function createNestServer(expressInstance: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Authentication')
    .setDescription('API for User Authentication Demo using Firebase and NestJS.')
    .setVersion('1.0')
    .addTag('Authentication')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Firebase Admin initialization
  const firebaseKeyFilePath = './taskboard-eb7da-firebase-adminsdk-sk515-52e7f30a99.json';
  if (fs.existsSync(firebaseKeyFilePath)) {
    const firebaseServiceAccount = JSON.parse(fs.readFileSync(firebaseKeyFilePath).toString());

    if (firebaseAdmin.apps.length === 0) {
      console.log('Initialize Firebase Application.');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
        databaseURL: 'https://taskboard-eb7da-default-rtdb.firebaseio.com'
      })
    }
  }
  await app.init();
}

// Set up the Firebase function
createNestServer(server);
export const api = functions.https.onRequest(server);

// Local development: start the server with `app.listen()`
if (!process.env.FUNCTIONS_EMULATOR && process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule); // Create Nest app directly
    const config = new DocumentBuilder()
      .setTitle('User Authentication')
      .setDescription('API for User Authentication Demo using Firebase and NestJS.')
      .setVersion('1.0')
      .addTag('Authentication')
      .addBearerAuth()
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors({
      allowedHeaders:"*",
      origin: "*"
    });
    await app.listen(process.env.PORTT); // Local server port
    console.log('NestJS server running at http://localhost:3000');
  }
  bootstrap();
}
