import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import { AppModule } from './src/app.module';
const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  const firebaseKeyFilePath = './taskboard-eb7da-firebase-adminsdk-sk515-52e7f30a99.json';
  if (fs.existsSync(firebaseKeyFilePath)) {
    const firebaseServiceAccount = JSON.parse(fs.readFileSync(firebaseKeyFilePath).toString());

    // if (firebaseAdmin.apps.length === 0) {
      console.log('Initialize Firebase Application.');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
      });
    }
  app.enableCors();
  await app.init();
};
export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});