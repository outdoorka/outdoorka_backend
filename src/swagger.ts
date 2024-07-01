import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const APP_URL = process.env.APP_URL || 'localhost:3006';
const SET_SCHEMES = APP_URL.includes('localhost') ? ['http', 'https'] : ['https'];

console.log('schemes : ', SET_SCHEMES, 'host : ', APP_URL);

const doc = {
  info: {
    version: '1.0.0',
    title: 'OUTDOORKA API',
    description: 'OUTDOORKA API Documentation'
  },
  host: APP_URL,
  basePath: '/',
  schemes: SET_SCHEMES,
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: '請加上 Bearer "Token" 以取得授權'
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
