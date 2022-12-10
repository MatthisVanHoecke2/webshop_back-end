const articleService = require('../service/articles');
const yup = require('yup');
const validate = require('./_validation');

const getAll = async (ctx) => {
  ctx.body = await articleService.getAll();
}

const getById = async (ctx) => {
  ctx.body = await articleService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

const getAllPortraits = async (ctx) => {
  ctx.body = await articleService.getAllPortraits();
}

const getPortraitByType = async (ctx) => {
  ctx.body = await articleService.getPortraitByType(ctx.params.type);
}
getPortraitByType.validationScheme = {
  params: yup.object({
    type: yup.string().required()
  })
}

module.exports = (router) => {
  const prefix = "/api/articles";

  router.get(prefix, getAll);
  router.get(`${prefix}/portraits`, getAllPortraits);
  router.get(`${prefix}/portraits/:type`, validate(getPortraitByType.validationScheme), getPortraitByType);
  router.get(`${prefix}/:id`, validate(getById.validationScheme), getById);
}