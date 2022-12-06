const installArticleRoutes = require('../rest/articles');
const installUserRoutes = require('../rest/users');
const installOrderRoutes = require('../rest/orders');
const installOrderlineRoutes = require('../rest/orderlines');

module.exports = (router) => {
  installArticleRoutes(router);
  installUserRoutes(router);
  installOrderRoutes(router);
  installOrderlineRoutes(router);
}