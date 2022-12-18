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
      params: {},
      headers: {}
    }
  }

  return async (ctx, next) => {
    if(!yup.isSchema(schema.params)) schema.params = yup.object(schema.params || {});
    if(!yup.isSchema(schema.body)) schema.body = yup.object(schema.body || {});
    if(!yup.isSchema(schema.headers)) schema.headers = yup.object(schema.headers || {});

    await schema.params.validate(ctx.params, YUPOPTIONS).then((val) => ctx.params = val).catch((err) => {
      errors.params = {};
      errors.params[err.type] = err.message;
    });
    await schema.body.validate(ctx.request.body, YUPOPTIONS).then((val) => ctx.request.body = val).catch((err) => {
      errors.body = {};
      errors.body[err.type] = err.message;
    });
    await schema.headers.validate(ctx.headers, YUPOPTIONS).then((val) => ctx.headers = val).catch((err) => {
      errors.headers = {};
      errors.headers[err.type] = err.message;
    }); 

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
