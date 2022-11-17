const articleService = require('../service/article');

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

module.exports = {
  getAll,
  getById,
  getAllPortraits,
  getPortraitByType
}