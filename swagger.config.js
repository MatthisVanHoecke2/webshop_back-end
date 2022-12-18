module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0'
    },
    servers: [{
      url: 'http://localhost:9000/',
    }],
  },
  apis: ['./src/rest/*.js']
}