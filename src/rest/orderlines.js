const orderlineService = require('../service/orderlines');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const getAll = async (ctx) => {
  ctx.body = await orderlineService.getAll();
}

const getById = async (ctx) => {
  ctx.body = await orderlineService.getById(ctx.params.id);
}

const getByOrderId = async (ctx) => {
  ctx.body = await orderlineService.getByOrderId(ctx.params.id);
}

const update = async (ctx) => {
  ctx.body = await orderlineService.update({id: ctx.params.id, ...ctx.request.body})
}

const create = async (ctx) => {
  ctx.body = await orderlineService.create(ctx.request.body);
}

module.exports = (router) => {
  const prefix = "/api/orderlines";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/order/:id`, requireAuthentication, getByOrderId);
  router.get(`${prefix}/:id`, requireAuthentication, requireAdmin, getById);
  router.put(`${prefix}/:id`, requireAuthentication, requireAdmin, update);
  router.post(`${prefix}/create`, requireAuthentication, create);
}