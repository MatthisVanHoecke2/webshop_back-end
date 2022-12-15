const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const yup = require('yup');
const config = require('config');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');
const statusTypes = config.get('statustypes');

const getAll = async (ctx) => {
  ctx.body = await orderService.getAll();
}

const getById = async (ctx) => {
  ctx.body = await orderService.getByOrderId(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

const getByUserId = async (ctx) => {
  ctx.body = await orderService.getByUserId(ctx.params.id);
}
getByUserId.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
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
create.validationScheme = {
  body: yup.object({
    orderData: yup.object({
      user: yup.number().required().positive().integer(),
      price: yup.number().required().positive()
    }),
    orderlinesData: yup.array(yup.object({
      order: yup.number().required().positive().integer(),
      article: yup.number().required().positive().integer(),
      status: yup.string().default(statusTypes[0]).test({
        name: 'create-status',
        skipAbsent: true,
        test(value) {
          if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
          return true;
        }
      }),
      price: yup.number().required().positive(),
      characters: yup.number().required().positive().integer(),
      imageUrl: yup.string().required().url().test({
        name: 'create-image',
        skipAbsent: false,
        test(value) {
          if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
          return true;
        }
      }), 
      description: yup.string().required(),
      detailed: yup.number().required().integer()
    }))
  })
}

const update = async (ctx) => {
  ctx.body = await orderService.update({id: ctx.params.id, ...ctx.request.body});
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: yup.object({
    price: yup.number().positive(), 
    status: yup.string().test({
      name: 'create-status',
      skipAbsent: true,
      test(value) {
        if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
        return true;
      }
    })
  })
}

module.exports = (router) => {
  const prefix = "/api/orders";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/count/completed`, requireAuthentication, requireAdmin, countCompleted);
  router.get(`${prefix}/count/pending`, requireAuthentication, requireAdmin, countPending);
  router.get(`${prefix}/user/:id`, requireAuthentication, validate(getByUserId.validationScheme), getByUserId);
  router.get(`${prefix}/recent`, requireAuthentication, requireAdmin, getRecent);
  router.get(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(getById.validationScheme), getById);
  router.post(`${prefix}/create`, requireAuthentication, validate(create.validationScheme), create);
  router.put(`${prefix}/update/:id`, requireAuthentication, validate(update.validationScheme), update);
}