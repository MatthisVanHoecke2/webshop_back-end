const articleService = require('../service/articles');
const yup = require('yup');
const validate = require('./_validation');

/**
 * @openapi
 * tags:
 *   name: Articles
 *   description: Represents an item a user can purchase
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Article:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - price
 *             - imageUrl
 *             - description
 *             - extra
 *           properties:
 *             name:
 *               type: "string"
 *             price:
 *               type: "double"
 *             articletype:
 *               type: "string"
 *             imageUrl:
 *               type: "string"
 *             description:
 *               type: "string"
 *             extra:
 *               type: "double"
 *           example:
 *             $ref: "#/components/examples/Article"
 *     ArticleList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Article"
 *   examples:
 *     Article:
 *       id: 123
 *       name: "Full Body"
 *       price: 22.50
 *       articletype: "fullbody"
 *       imageUrl: "image.png"
 *       description: "A simple description of an article"
 *       extra: 5.70
 *   requestBodies:
 *     Article:
 *       description: The Article info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Head"
 *               price:
 *                 type: double
 *                 example: 22.50
 *               articletype:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               extra:
 *                 type: double
 */

/**
 * @openapi
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags:
 *      - Articles
 *     responses:
 *       200:
 *         description: List of articles
 */
const getAll = async (ctx) => {
  ctx.body = await articleService.getAll();
}

/**
 * @openapi
 * /api/articles/{id}:
 *   get:
 *     summary: Get a single article with a specific id
 *     tags:
 *      - Articles
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 */
const getById = async (ctx) => {
  ctx.body = await articleService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  })
}

/**
 * @openapi
 * /api/articles/portraits:
 *   get:
 *     summary: Get all articles that are portraits
 *     tags:
 *      - Articles
 *     responses:
 *       200:
 *         description: The requested article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 */
const getAllPortraits = async (ctx) => {
  ctx.body = await articleService.getAllPortraits();
}

/**
 * @openapi
 * /api/articles/portraits/{id}:
 *   get:
 *     summary: Get all articles that are portraits
 *     tags:
 *      - Articles
 *     parameters:
 *       - $ref: "#/components/parameters/typeParam"
 *     responses:
 *       200:
 *         description: The requested article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 */
const getPortraitByType = async (ctx) => {
  ctx.body = await articleService.getPortraitByType(ctx.params.type);
}
getPortraitByType.validationScheme = {
  params: yup.object({
    type: yup.string().required()
  })
}

module.exports = (router) => {
  const prefix = "/api/articles";

  router.get(prefix, getAll);
  router.get(`${prefix}/portraits`, getAllPortraits);
  router.get(`${prefix}/portraits/:type`, validate(getPortraitByType.validationScheme), getPortraitByType);
  router.get(`${prefix}/:id`, validate(getById.validationScheme), getById);
}