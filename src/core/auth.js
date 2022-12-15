const userService = require('../service/users');

module.exports.requireAuthentication = async (ctx, next) => {
  if(ctx.request.ip === '::ffff:127.0.0.1') return next();
  const {authorization} = ctx.headers;

  const checkAndParse = await userService.checkAndParseSession(authorization);

  if(!checkAndParse) return;
  
  const {authToken, ...session} = checkAndParse;

  ctx.state.session = session;
  ctx.state.authToken = authToken;
  return next();
}

module.exports.makeRequireRole = () => async (ctx, next) => {
  if(ctx.request.ip === '::ffff:127.0.0.1') return next();
  const { isAdmin } = ctx.state.session;

  userService.checkRole(isAdmin);
  return next();
}