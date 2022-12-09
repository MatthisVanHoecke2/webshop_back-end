const yup = require('yup');

const YUPOPTIONS = {
  abortEarly: yup.boolean = true,
  stripUnknown: yup.boolean = true,
  strict: yup.boolean = false
}

const validate = (schema) => {
  const errors = {};
  if(!schema) {
    schema = {
      query: {},
      body: {},
      params: {}
    }
  }

  return async (ctx, next) => {
    if(!yup.isSchema(schema.params)) schema.params = yup.object(schema.params || {});
    if(!yup.isSchema(schema.body)) schema.body = yup.object(schema.body || {});

    await schema.params.validate(ctx.params, YUPOPTIONS).then((val) => ctx.params = val).catch((err) => errors.params = err);
    await schema.body.validate(ctx.request.body, YUPOPTIONS).then((val) => ctx.request.body = val).catch((err) => errors.body = err); 

    if(Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors
      })
    }
    return next();
  }
}

module.exports = validate;
