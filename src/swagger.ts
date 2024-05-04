import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const APP_URL = process.env.APP_URL || 'http://localhost:3006';
console.log('host : ', APP_URL);

const doc = {
  info: {
    version: '1.0.0',
    title: 'OUTDOORKA API',
    description: 'OUTDOORKA API Documentation'
  },
  host: APP_URL,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: '請加上 Bearer Token 以取得授權'
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./app.ts'];

swaggerAutogen()(outputFile, routes, doc)
  .then(() => {
    console.log('Swagger file created successfully.');
  })
  .catch((err) => {
    console.error(err);
  });
