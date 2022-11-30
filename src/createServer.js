const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const koaCors = require('@koa/cors');
const { getLogger } = require('./core/logging');
const installRest = require('./rest/index');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const port = config.get('port');
const app = new Koa();
const logger = getLogger();
const router = new Router();

function start() {
  app.use(koaCors({
    origin: (ctx) => {
      if(CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) return ctx.request.header.origin;
      return CORS_ORIGINS[0];
    },
    allowHeaders: ['Accept', "Content-Type", "Authorization"],
    maxAge: CORS_MAX_AGE
  }))
  
  app.use(bodyParser());
  
  app
  .use(router.routes())
  .use(router.allowedMethods());
  
  installRest(router);
  
  logger.info(`🚀 Server listening on http://localhost:9000`);
  app.listen(9000);
}

module.exports = {
  start
}