const installArticleRoutes = require('../rest/articles');
const installUserRoutes = require('../rest/users');

module.exports = (router) => {
  installArticleRoutes(router);
  installUserRoutes(router);
}