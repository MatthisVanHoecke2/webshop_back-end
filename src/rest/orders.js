const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const countAll = async (ctx) => {
  ctx.body = await orderService.countAll();
}

const getRecent = async (ctx) => {
  ctx.body = await orderService.getRecent();
}

module.exports = (router) => {
  const prefix = "/api/orders";

  const requireAdmin = makeRequireRole();

  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/recent`, requireAuthentication, requireAdmin, getRecent);
}