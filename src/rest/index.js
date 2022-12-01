const installArticleRoutes = require('../rest/articles');
const installUserRoutes = require('../rest/users');
const installOrderRoutes = require('../rest/orders');

module.exports = (router) => {
  installArticleRoutes(router);
  installUserRoutes(router);
  installOrderRoutes(router);
}