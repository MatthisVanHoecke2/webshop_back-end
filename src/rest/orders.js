const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const yup = require('yup');
const config = require('config');
const validate = require('./_validation');
const statusTypes = config.get('statustypes');

const getAll = async (ctx) => {
  ctx.body = await orderService.getAll();
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
    orderData: {
      user: yup.number().required().positive().integer(),
      price: yup.number().required().positive()
    },
    orderlinesData: {
      order: yup.number().required().positive().integer(),
      status: yup.string().default(statusTypes[0]).test({
        name: 'create-status',
        skipAbsent: false,
        test(value) {
          if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
        }
      }),
      price: yup.number().required().positive(),
      character: yup.number().required().positive().integer(),
      imageUrl: yup.string().required().url().test({
        name: 'create-image',
        skipAbsent: false,
        test(value) {
          if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
        }
      }), 
      detailed: yup.number().required().positive().integer()
    }
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
  router.post(`${prefix}/create`, requireAuthentication, validate(create.validationScheme), create);
  router.post(`${prefix}/update/:id`, requireAuthentication, validate(update.validationScheme), update);
}