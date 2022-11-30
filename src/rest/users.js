const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const getAll = async (ctx) => {
  ctx.body = await userService.getAll();
}
const getById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
}
const update = async (ctx) => {
  ctx.body = await userService.update({ id: ctx.params.id, ...ctx.request.body });
}
const login = async (ctx) => {
  const { user, password } = ctx.request.body;
  const session = await userService.login(user, password);
  ctx.body = session;
}
const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
}

const getByToken = async (ctx) => {
  const session = await userService.checkAndParseSession(ctx.headers.authorization);
  if(session.message) {
    ctx.status = 500;
    ctx.body = session.message;
  }
  else ctx.body = await userService.getById(session.id);
  
}

module.exports = (router) => {
  const prefix = "/api/users";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/token`, requireAuthentication, getByToken);
  router.get(`${prefix}/:id`, requireAuthentication, getById);
  router.put(`${prefix}/:id`, requireAuthentication, update);
  router.post(`${prefix}/login`, login);
  router.post(`${prefix}`, register);
}