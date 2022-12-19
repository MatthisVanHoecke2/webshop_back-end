const orderlineService = require('../service/orderlines');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const yup = require('yup');
const config = require('config');
const ServiceError = require('../core/serviceError');
const validate = require('./_validation');
const statusTypes = config.get('statustypes');

/**
 * @openapi
 * tags:
 *   name: Orderlines
 *   description: Represents the details of an ordered article
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Orderline:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - article
 *             - order
 *             - description
 *             - price
 *             - characters
 *             - detailed
 *             - imageUrl
 *             - status
 *           properties:
 *             article:
 *               $ref: "#/components/schemas/Article"
 *             order:
 *               $ref: "#/components/schemas/Order"
 *             description:
 *               type: "string"
 *             price:
 *               type: "double"
 *             characters:
 *               type: "smallint"
 *             detailed:
 *               type: "smallint"
 *             imageUrl:
 *               type: "string"
 *             status:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Orderline"
 *     OrderlineList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Orderline"
 *   examples:
 *     Orderline:
 *       id: 150
 *       article: 3
 *       order: 100
 *       description: "A simple description of an orderline"
 *       price: 10.50
 *       characters: 2
 *       detailed: 1
 *       imageUrl: "https://example.com/image.png"
 *       status: "In Queue"
 *   requestBodies:
 *     Orderline:
 *       description: The Orderline info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article:
 *                 type: integer
 *                 format: int32
 *               order:
 *                 type: integer
 *                 format: int32
 *               description:
 *                 type: string
 *               price:
 *                 type: double
 *               characters:
 *                 type: smallint
 *               detailed:
 *                 type: smallint
 *               imageUrl:
 *                 type: string
 *               status:
 *                 type: string
 */


/**
 * @openapi
 * /api/orderlines:
 *   get:
 *     summary: Get all orderlines
 *     tags:
 *      - Orderlines
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orderline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderlineList"
 */
const getAll = async (ctx) => {
  ctx.body = await orderlineService.getAll();
}

/**
 * @openapi
 * /api/orderlines/{id}:
 *   get:
 *     summary: Get a single orderline with the specified id
 *     tags:
 *      - Orderlines
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested orderline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderlineList"
 *       404:
 *         description: No orderline with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getById = async (ctx) => {
  ctx.body = await orderlineService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

/**
 * @openapi
 * /api/orderlines/order/{id}:
 *   get:
 *     summary: Get all orderlines with the specified order id
 *     tags:
 *      - Orderlines
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested orderlines
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderlineList"
 *       404:
 *         description: No orderline with the given order id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getByOrderId = async (ctx) => {
  ctx.body = await orderlineService.getByOrderId(ctx.params.id);
}
getByOrderId.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

/**
 * @openapi
 * /api/orderlines/{id}:
 *   put:
 *     summary: Update an existing orderline
 *     tags:
 *      - Orderlines
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Orderline"
 *     responses:
 *       200:
 *         description: The updated orderline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Orderline"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No orderline with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const update = async (ctx) => {
  ctx.body = await orderlineService.update({id: ctx.params.id, ...ctx.request.body})
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: yup.object({
    order: yup.number().required().positive().integer(),
    status: yup.string().test({
      name: 'update-status',
      skipAbsent: true,
      test(value) {
        if(!value) return true;
        if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
        return true;
      }
    }),
    price: yup.number().positive(),
    character: yup.number().positive().integer(),
    imageUrl: yup.string().url().test({
      name: 'update-image',
      skipAbsent: true,
      test(value) {
        if(!value) return true;
        if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
        return true;
      }
    }), 
    detailed: yup.number().positive().integer()
  })
}

/**
 * @openapi
 * /api/orderlines:
 *   post:
 *     summary: Create orderline
 *     description: Create an orderline
 *     tags:
 *      - Orderlines
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/Orderline'
 *     responses:
 *       200:
 *         description: The created orderline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Orderline"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const create = async (ctx) => {
  ctx.body = await orderlineService.create(ctx.request.body);
}
create.validationScheme = {
  body: yup.object({
    order: yup.number().required().positive().integer(),
    status: yup.string().default(statusTypes[0]).test({
      name: 'create-status',
      skipAbsent: false,
      test(value) {
        if(!statusTypes.includes(value)) throw ServiceError.validationFailed(`'${value}' is not a valid status`);
        return true;
      }
    }),
    price: yup.number().required().positive(),
    character: yup.number().required().positive().integer(),
    imageUrl: yup.string().required().url().test({
      name: 'create-image',
      skipAbsent: false,
      test(value) {
        if(!value.endsWith('.png') && !value.endsWith('.jpg') && !value.endsWith('.jpeg')) throw ServiceError.validationFailed('URL has to end with .png, .jpg or .jpeg');
        return true;
      }
    }), 
    detailed: yup.number().required().positive().integer()
  })
}

module.exports = (router) => {
  const prefix = "/api/orderlines";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/order/:id`, requireAuthentication, validate(getByOrderId.validationScheme), getByOrderId);
  router.get(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(getById.validationScheme), getById);
  router.put(`${prefix}/:id`, requireAuthentication, requireAdmin, validate(update.validationScheme), update);
  router.post(`${prefix}`, requireAuthentication, validate(create.validationScheme), create);
}