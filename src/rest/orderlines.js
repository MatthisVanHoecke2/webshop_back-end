const orderlineService = require('../service/orderlines');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const yup = require('yup');
const config = require('config');
const ServiceError = require('../core/serviceError');
const validate = require('./_validation');
const statusTypes = config.get('statustypes');

const getAll = async (ctx) => {
  ctx.body = await orderlineService.getAll();
}

const getById = async (ctx) => {
  ctx.body = await orderlineService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

const getByOrderId = async (ctx) => {
  ctx.body = await orderlineService.getByOrderId(ctx.params.id);
}
getByOrderId.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

const update = async (ctx) => {
  ctx.body = await orderlineService.update({id: ctx.params.id, ...ctx.request.body})
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: yup.object({
    order: yup.number().required().positive().integer(),
    status: yup.string().test({
      name: 'update-status',
      skipAbsent: true,
      test(value) {
        if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
      }
    }),
    price: yup.number().positive(),
    character: yup.number().positive().integer(),
    imageUrl: yup.string().url().test({
      name: 'update-image',
      skipAbsent: true,
      test(value) {
        if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
      }
    }), 
    detailed: yup.number().positive().integer()
  })
}

const create = async (ctx) => {
  ctx.body = await orderlineService.create(ctx.request.body);
}
create.validationScheme = {
  body: yup.object({
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
  })
}

module.exports = (router) => {
  const prefix = "/api/orderlines";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/order/:id`, requireAuthentication, validate(getByOrderId.validationScheme), getByOrderId);
  router.get(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(getById.validationScheme), getById);
  router.put(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(update.validationScheme), update);
  router.post(`${prefix}/create`, requireAuthentication, validate(create.validationScheme), create);
}