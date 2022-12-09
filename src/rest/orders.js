const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const getAll = async (ctx) => {
  ctx.body = await orderService.getAll();
}

const getByUserId = async (ctx) => {
  ctx.body = await orderService.getByUserId(ctx.params.id);
}

const countAll = async (ctx) => {
  ctx.body = await orderService.countAll();
}

const getRecent = async (ctx) => {
  ctx.body = await orderService.getRecent();
}

const countCompleted = async (ctx) => {
  ctx.body = await orderService.countCompleted();
}

const countPending = async (ctx) => {
  ctx.body = await orderService.countPending();
}

const create = async (ctx) => {
  ctx.body = await orderService.create(ctx.request.body);
}

const update = async (ctx) => {
  ctx.body = await orderService.update({id: ctx.params.id, ...ctx.request.body});
}

module.exports = (router) => {
  const prefix = "/api/orders";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/count/completed`, requireAuthentication, requireAdmin, countCompleted);
  router.get(`${prefix}/count/pending`, requireAuthentication, requireAdmin, countPending);
  router.get(`${prefix}/user/:id`, requireAuthentication, getByUserId);
  router.get(`${prefix}/recent`, requireAuthentication, requireAdmin, getRecent);
  router.post(`${prefix}/create`, requireAuthentication, create);
  router.post(`${prefix}/update/:id`, requireAuthentication, update);
}