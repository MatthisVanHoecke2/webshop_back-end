const yup = require('yup');
const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const validate = require('./_validation');

const countAll = async (ctx) => {
  ctx.body = await userService.countAll();
}
const getAll = async (ctx) => {
  ctx.body = await userService.getAll();
}
const getById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: {
    id: yup.number().required().positive().integer()
  }
}

const update = async (ctx) => {
  ctx.body = await userService.update({ id: ctx.params.id, ...ctx.request.body });
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: {
    name: yup.string(),
    email: yup.string().email(),
    password: yup.string().test({
      name: 'check-password',
      skipAbsent: true,
      test(value, ctx) {
        if(!/^.*(.){8,}.*$/.test(value)) {
          return ctx.createError({ message: 'Password must be at least 8 characters long' });
        }
        else if(!/^.*([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*){1,}.*$/.test(value)) {
          return ctx.createError({ message: 'Password must contain at least 1 special character' });
        }
        else if(!/^.*(\d{2,}).*$/.test(value)) {
          return ctx.createError({ message: 'Password must contain at least 2 numbers' });
        }
      }
    })
  }
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
    ctx.status = 400;
    ctx.body = session.message;
  }
  else ctx.body = await userService.getById(session.id);
  
}

module.exports = (router) => {
  const prefix = "/api/users";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/token`, requireAuthentication, getByToken);
  router.get(`${prefix}/:id`, validate(getById.validationScheme), getById);
  router.put(`${prefix}/:id`, requireAuthentication, validate(update.validationScheme), update);
  router.post(`${prefix}/login`, login);
  router.post(`${prefix}`, register);
}