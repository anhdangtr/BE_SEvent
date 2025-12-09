const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Sevent API',
      version: '1.0.0',
      description: 'API documentation for Sevent project',
    },
    servers: [
      { url: 'https://seventwebsite.onrender.com' },
    ],
  },
  apis: [path.join(__dirname, 'src', 'routes', '*.js')], // <-- sửa đường dẫn
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

console.log('Swagger docs paths:', Object.keys(swaggerDocs.paths));

module.exports = (app) => {
  console.log('[Swagger] Setting up /api-docs route...');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('[Swagger] Route /api-docs is now available');
};
