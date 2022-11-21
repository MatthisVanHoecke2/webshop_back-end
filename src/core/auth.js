const userService = require('../service/users');

module.exports.requireAuthentication = async (ctx, next) => {
  const {authorization} = ctx.headers;

  const {authToken, ...session} = await userService.checkAndParseSession(authorization);

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
}

module.exports.makeRequireRole = () => async (ctx, next) => {
  const { isAdmin } = ctx.state.session;

  userService.checkRole(isAdmin);
  return next();
}