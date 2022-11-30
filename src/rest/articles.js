const articleService = require('../service/articles');

const getAll = async (ctx) => {
  ctx.body = await articleService.getAll();
}

const getById = async (ctx) => {
  ctx.body = await articleService.getById(ctx.params.id);
}

const getAllPortraits = async (ctx) => {
  ctx.body = await articleService.getAllPortraits();
}

const getPortraitByType = async (ctx) => {
  ctx.body = await articleService.getPortraitByType(ctx.params.type);
}

module.exports = (router) => {
  const prefix = "/api/articles";

  router.get(prefix, getAll);
  router.get(`${prefix}/portraits`, getAllPortraits);
  router.get(`${prefix}/portraits/:type`, getPortraitByType);
  router.get(`${prefix}/:id`, getById);
}