import { defineMiddleware } from 'astro:middleware';
import { initDatabaseConfig } from '@meteor/db';
import {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_ROOT_USER,
  MONGO_ROOT_PASSWORD,
  DATABASE_NAME,
  MONGO_AUTH_SOURCE,
  MONGODB_URI,
} from 'astro:env/server';

initDatabaseConfig({
  host: MONGO_HOST,
  port: MONGO_PORT,
  user: MONGO_ROOT_USER,
  password: MONGO_ROOT_PASSWORD,
  databaseName: DATABASE_NAME,
  authSource: MONGO_AUTH_SOURCE,
  uri: MONGODB_URI,
});

export const onRequest = defineMiddleware(async (context, next) => {
  return next();
});
