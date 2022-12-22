const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const yup = require('yup');
const config = require('config');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');
const statusTypes = config.get('statustypes');

/**
 * @openapi
 * tags:
 *   name: Orders
 *   description: Represents a collection of articles ordered by the user
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - user
 *             - date
 *             - price
 *             - status
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/User"
 *             date:
 *               type: "string"
 *               format: date-time
 *             price:
 *               type: "double"
 *             status:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Order"
 *     OrderList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
 *   examples:
 *     Order:
 *       id: 123
 *       user: 100
 *       date: "2022-12-18 19:00:00"
 *       price: 80.50
 *       status: "In Queue"
 *   requestBodies:
 *     CreateOrder:
 *       description: The Order info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderdata:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: integer
 *                     format: int32
 *                     example: 5
 *                   date:
 *                     type: "string"
 *                     format: date-time
 *                     example: "2022-12-18 19:00:00"
 *                   price:
 *                     type: "double"
 *                     example: 80.50
 *                   status:
 *                     type: "string"
 *                     example: "In Queue"
 *               orderlinesData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     article:
 *                       type: integer
 *                       format: int32
 *                       example: 3
 *                     description:
 *                       type: string
 *                       example: "description for orderline"
 *                     price:
 *                       type: double
 *                       example: 40.25
 *                     characters:
 *                       type: smallint
 *                       example: 3
 *                     detailed:
 *                       type: smallint
 *                       example: 1
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/image.png"
 *                     status:
 *                       type: string
 *                       example: "In Queue"
 *     UpdateOrder:
 *       description: The Order info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: integer
 *                 format: int32
 *                 example: 3
 *               date:
 *                 type: string
 *                 format: dat"-time
 *                 example: "2022-12-18 19:00:00"
 *               price:
 *                 type: double
 *                 example: 4.75
 *               status:
 *                 type: string
 *                 example: "In Progress"
 */

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderList"
 */
const getAll = async (ctx) => {
  ctx.body = await orderService.getAll();
}

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order with the specified id
 *     tags:
 *      - Orders
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderList"
 *       404:
 *         description: No order with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getById = async (ctx) => {
  ctx.body = await orderService.getByOrderId(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

/**
 * @openapi
 * /api/orders/user/{id}:
 *   get:
 *     summary: Get all the orders of a specific user
 *     tags:
 *      - Orders
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderList"
 *       404:
 *         description: No order with the given user id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getByUserId = async (ctx) => {
  ctx.body = await orderService.getByUserId(ctx.params.id);
}
getByUserId.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

/**
 * @openapi
 * /api/orders/recent:
 *   get:
 *     summary: Get the 10 most recent orders
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount of orders
 */
const getRecent = async (ctx) => {
  ctx.body = await orderService.getRecent();
}

/**
 * @openapi
 * /api/orders/count:
 *   get:
 *     summary: Count all orders
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount of orders
 */
const countAll = async (ctx) => {
  ctx.body = await orderService.countAll();
}

/**
 * @openapi
 * /api/orders/count/completed:
 *   get:
 *     summary: Count all completed orders
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount of completed orders
 */
const countCompleted = async (ctx) => {
  ctx.body = await orderService.countCompleted();
}

/**
 * @openapi
 * /api/orders/count/pending:
 *   get:
 *     summary: Count all pending orders
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount of pending orders
 */
const countPending = async (ctx) => {
  ctx.body = await orderService.countPending();
}

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the signed in user.
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateOrder"
 *     responses:
 *       200:
 *         description: The created order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderList"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const create = async (ctx) => {
  ctx.body = await orderService.create(ctx.request.body);
}
create.validationScheme = {
  body: yup.object({
    orderData: yup.object({
      user: yup.number().required().positive().integer(),
      price: yup.number().required().positive()
    }),
    orderlinesData: yup.array(yup.object({
      article: yup.number().required().positive().integer(),
      status: yup.string().default(statusTypes[0]).test({
        name: 'create-status',
        skipAbsent: true,
        test(value) {
          if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
          return true;
        }
      }),
      price: yup.number().required().positive(),
      characters: yup.number().required().positive().integer(),
      imageUrl: yup.string().required().url().test({
        name: 'create-image',
        skipAbsent: false,
        test(value) {
          if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
          return true;
        }
      }), 
      description: yup.string().required(),
      detailed: yup.number().required().integer()
    }))
  })
}

/**
 * @openapi
 * /api/orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     tags:
 *      - Orders
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateOrder"
 *     responses:
 *       200:
 *         description: The updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderList"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No order with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const update = async (ctx) => {
  ctx.body = await orderService.update({id: ctx.params.id, ...ctx.request.body});
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: yup.object({
    price: yup.number().positive(), 
    status: yup.string().test({
      name: 'create-status',
      skipAbsent: true,
      test(value) {
        if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
        return true;
      }
    })
  })
}

module.exports = (router) => {
  const prefix = "/api/orders";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/count/completed`, requireAuthentication, requireAdmin, countCompleted);
  router.get(`${prefix}/count/pending`, requireAuthentication, requireAdmin, countPending);
  router.get(`${prefix}/user/:id`, requireAuthentication, validate(getByUserId.validationScheme), getByUserId);
  router.get(`${prefix}/recent`, requireAuthentication, requireAdmin, getRecent);
  router.get(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(getById.validationScheme), getById);
  router.post(`${prefix}`, requireAuthentication, validate(create.validationScheme), create);
  router.put(`${prefix}/update/:id`, requireAuthentication, validate(update.validationScheme), update);
}