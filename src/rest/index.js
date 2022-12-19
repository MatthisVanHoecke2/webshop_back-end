const installArticleRoutes = require('../rest/articles');
const installUserRoutes = require('../rest/users');
const installOrderRoutes = require('../rest/orders');
const installOrderlineRoutes = require('../rest/orderlines');

/**
 * @openapi
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           format: "int32"
 *       example:
 *         id: 123
 *     ListResponse:
 *       required:
 *         - count
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       description: Id of the item to fetch/update/delete
 *       required: true
 *       schema:
 *         type: integer
 *         format: "int32"
 *     typeParam:
 *       in: path
 *       name: type
 *       description: Type of the item to fetch
 *       required: true
 *       schema:
 *         type: string
 */

/**
 * @openapi
 * components:
 *   responses:
 *     400BadRequest:
 *       allOf:
 *         - type: object
 *           required:
 *             - code
 *             - details
 *           properties:
 *             code:
 *               type: string
 *             details:
 *               type: string
 *               description: Extra information about the specific bad request error that occured
 *             stack:
 *               type: string
 *               description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "VALIDATION_FAILED"
 *             details: "Email needs to be a valid email address"
 */

/**
 * @openapi
 * components:
 *   responses:
 *     403Forbidden:
 *       allOf:
 *         - type: object
 *           required:
 *             - code
 *             - details
 *           properties:
 *             code:
 *               type: string
 *             details:
 *               type: string
 *               description: Extra information about the specific forbidden error that occured
 *             stack:
 *               type: string
 *               description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "FORBIDDEN"
 *             details: "You need to be logged in"
 */

/**
 * @openapi
 * components:
 *   responses:
 *     404NotFound:
 *       allOf:
 *         - type: object
 *           required:
 *             - code
 *             - details
 *           properties:
 *             code:
 *               type: string
 *             details:
 *               type: string
 *               description: Extra information about the specific not found error that occured
 *             stack:
 *               type: string
 *               description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "NOT_FOUND"
 *             details: "No user with the id 123 exists"
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = (router) => {
  installArticleRoutes(router);
  installUserRoutes(router);
  installOrderRoutes(router);
  installOrderlineRoutes(router);
}