const yup = require('yup');
const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');

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




const passwordValidation = {
  name: 'check-password',
  skipAbsent: true,
  test(value) {
    if(!/^.*(.){8,}.*$/.test(value)) throw ServiceError.validationFailed('Password must be at least 8 characters long');
    else if(!/^.*([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*){1,}.*$/.test(value)) throw ServiceError.validationFailed('Password must contain at least 1 special character');
    else if(!/^.*(\d{2,}).*$/.test(value)) throw ServiceError.validationFailed('Password must contain at least 2 numbers');
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
    password: yup.string().test(passwordValidation)
  }
}

const login = async (ctx) => {
  const { user, password } = ctx.request.body;
  const session = await userService.login(user, password);
  ctx.body = session;
}
login.validationScheme = {
  body: yup.object({
    user: yup.string().required(),
    password: yup.string().test(passwordValidation) 
  })
}

const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
}
register.validationScheme = {
  body: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().test(passwordValidation)
  })
}

const getByToken = async (ctx) => {
  const session = await userService.checkAndParseSession(ctx.headers.authorization);
  
  if(session.message) throw ServiceError.validationFailed(session.message);
  else ctx.body = await userService.getById(session.id);
}
getByToken.validationScheme = {
  headers: yup.object({
    authorization: yup.string().required().test({
      name: 'check-token',
      skipAbsent: false,
      test(value) {
        if(!value) throw ServiceError.unauthorized("You need to be signed in");
        else if(!value.startsWith('Bearer ')) throw ServiceError.validationFailed("Invalid authentication token");
      }
    })
  })
}

module.exports = (router) => {
  const prefix = "/api/users";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/token`, requireAuthentication, validate(getByToken.validationScheme), getByToken);
  router.get(`${prefix}/:id`, requireAuthentication, validate(getById.validationScheme), getById);
  router.put(`${prefix}/:id`, requireAuthentication, validate(update.validationScheme), update);
  router.post(`${prefix}/login`, validate(login.validationScheme), login);
  router.post(`${prefix}`, validate(register.validationScheme), register);
}