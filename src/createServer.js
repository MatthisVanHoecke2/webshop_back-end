const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const koaCors = require('@koa/cors');
const { getLogger } = require('./core/logging');
const installRest = require('./rest/index');
const emoji = require('node-emoji');
const {serializeError} = require('serialize-error');
const ServiceError = require('./core/serviceError');
const { shutdownData, initializeData } = require('./data');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const PORT = config.get('port');
const app = new Koa();
const logger = getLogger();
const router = new Router();
const NODE_ENV = config.get('env');

module.exports = async function createServer() {
  app.use(async (ctx, next) => {
    const logger = getLogger();
    logger.info(`${emoji.get('fast-forward')} ${ctx.method} ${ctx.url}`);
  
    const getStatusEmoji = () => {
      if(ctx.status >= 500) return emoji.get('skull');
      if(ctx.status >= 400) return emoji.get('x');
      if(ctx.status >= 300) return emoji.get('rocket');
      if(ctx.status >= 200) return emoji.get('white_check_mark');
      return emoji.get('rewind');
    }

    try {
      await next();
      logger.info(
        `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`,
      );
    } catch (error) {
      logger.error(`${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`, {
        error,
      });
      throw error;
    }
  })

  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: 'NOT_FOUND',
          message: `Unknown resource: ${ctx.url}`,
        };
        ctx.status = 404;
      }
    }
    catch(error) {

      const logger = getLogger();
      logger.error('Error occured while handling a request', {
        error: serializeError(error),
      });

      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV !== 'production' ? error.stack : undefined
      }

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }
  
        if (error.isValidationFailed) {
          statusCode = 400;
        }
  
        if (error.isUnauthorized) {
          statusCode = 401;
        }
  
        if (error.isForbidden) {
          statusCode = 403;
        }
      }

      ctx.status = statusCode;
		  ctx.body = errorBody;
    }
  })

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

  await initializeData();

  installRest(router);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise((resolve) => {
        app.listen(PORT);
        logger.info(`🚀 Server listening on http://localhost:9000`);
        resolve();
      })
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye');
    }
  }
}