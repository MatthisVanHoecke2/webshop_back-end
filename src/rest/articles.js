const articleService = require('../service/articles');

const getAll = async (ctx) => {
  ctx.body = await articleService.getAll();
}

const getById = async (ctx, id) => {
  ctx.body = await articleService.getById(id);
}

const getAllPortraits = async (ctx) => {
  ctx.body = await articleService.getAllPortraits();
}

const getPortraitByType = async (ctx, type) => {
  ctx.body = await articleService.getPortraitByType(type);
}

module.exports = (router) => {
  const prefix = "/api/articles";

  router.get(prefix, async (ctx) => {
    await getAll(ctx);
  });

  router.get(`${prefix}/portraits`, async (ctx) => {
    await getAllPortraits(ctx);
  });

  router.get(`${prefix}/portraits/:type`, async (ctx) => {
    await getPortraitByType(ctx, ctx.params.type);
  });

  router.get(`${prefix}/:id`, async (ctx) => {
    await getById(ctx, ctx.params.id);
  });
}