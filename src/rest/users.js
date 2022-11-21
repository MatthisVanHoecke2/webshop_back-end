const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const getAll = async (ctx) => {
  ctx.body = await userService.getAll();
}
const getById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
}
const create = async (ctx) => {
  ctx.body = await userService.create(ctx.request.body);
}
const update = async (ctx) => {
  ctx.body = await userService.update({ id: ctx.params.id, ...ctx.request.body });
}
const login = async (ctx) => {
  const { nameOrEmail, password } = ctx.request.body;
  const session = await userService.login(nameOrEmail, password);
  ctx.body = session;
}
const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
}

module.exports = (router) => {
  const prefix = "/api/users";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/:id`, requireAuthentication, getById);
  router.post(prefix, requireAuthentication, create);
  router.put(`${prefix}/:id`, requireAuthentication, update);
  router.post(`${prefix}/login`, requireAuthentication, login);
  router.post(`${prefix}/register`, requireAuthentication, register);
}