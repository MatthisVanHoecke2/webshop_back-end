const yup = require('yup');

const YUPOPTIONS = {
  abortEarly: yup.boolean = true,
  stripUnknown: yup.boolean = true,
  strict: yup.boolean = false
}

const cleanupJoiError = (error) => {
  let resultObj = {};
  const { message, path, type } = error;

	const joinedPath = path || 'value';
	if (!resultObj[joinedPath]) {
		resultObj[joinedPath] = [];
	}
	resultObj[joinedPath].push({
		type,
		message,
	});

	return resultObj;
};

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
    
    await schema.params.validate(schema.params.cast(ctx.params), YUPOPTIONS).then((val) => ctx.params = val).catch((err) => errors.params = cleanupJoiError(err));
    await schema.body.validate(schema.body.cast(ctx.request.body), YUPOPTIONS).then((val) => ctx.request.body = val).catch((err) => errors.body = cleanupJoiError(err));
    await schema.headers.validate(schema.headers.cast(ctx.headers), YUPOPTIONS).then((val) => ctx.headers = val).catch((err) => errors.headers = cleanupJoiError(err)); 

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
