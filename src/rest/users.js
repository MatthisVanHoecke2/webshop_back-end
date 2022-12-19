const yup = require('yup');
const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const validate = require('./_validation');
const ServiceError = require('../core/serviceError');

const passwordValidation = {
  name: 'check-password',
  skipAbsent: true,
  test(value) {
    if(!value) return true;
    if(!/^.*(.){8,}.*$/.test(value)) throw ServiceError.validationFailed('Password must be at least 8 characters long');
    else if(!/^.*([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*){1,}.*$/.test(value)) throw ServiceError.validationFailed('Password must contain at least 1 special character');
    else if(!/^.*(\d{2,}).*$/.test(value)) throw ServiceError.validationFailed('Password must contain at least 2 numbers');
    return true;
  }
}

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Represents a registered user
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *             - isAdmin
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *             password:
 *               type: "string"
 *             isAdmin:
 *               type: "smallint"
 *           example:
 *             $ref: "#/components/examples/User"
 *     UserList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   examples:
 *     User:
 *       id: 100
 *       name: "Edward Kenway"
 *       email: "edward.kenway@gmail.com"
 *       password: "0a123b92f789055b946659e816834465"
 *       isAdmin: 1
 *   requestBodies:
 *     CreateUser:
 *       description: The User info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     LoginUser:
 *       description: The info to log in with.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               password:
 *                 type: string
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - Users
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserList"
 */
const getAll = async (ctx) => {
  ctx.body = await userService.getAll();
}

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user with the specified id
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserList"
 *       404:
 *         description: No user with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
}
getById.validationScheme = {
  params: {
    id: yup.number().required().positive().integer()
  }
}

/**
 * @openapi
 * /api/users/count:
 *   get:
 *     summary: Count all users
 *     tags:
 *      - Users
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount of users
 */
const countAll = async (ctx) => {
  ctx.body = await userService.countAll();
}

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateUser"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No user with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const update = async (ctx) => {
  ctx.body = await userService.update({ id: ctx.params.id, ...ctx.request.body });
}
update.validationScheme = {
  params: yup.object({
    id: yup.number().required().positive().integer()
  }),
  body: {
    name: yup.string(),
    email: yup.string().email(),
    password: yup.string().test(passwordValidation)
  }
}

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Log in as a registered user
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginUser'
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No user with the name and password could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const login = async (ctx) => {
  const { user, password } = ctx.request.body;
  const session = await userService.login(user, password);
  ctx.body = session;
}
login.validationScheme = {
  body: yup.object({
    user: yup.string().required(),
    password: yup.string().required()
  })
}

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create user
 *     description: Register a user
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateUser'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
}
register.validationScheme = {
  body: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().test(passwordValidation)
  })
}

/**
 * @openapi
 * /api/users/token:
 *   get:
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The user with the specified token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: JWT expired or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const getByToken = async (ctx) => {
  const session = await userService.checkAndParseSession(ctx.headers.authorization);
  
  if(session.message) throw ServiceError.validationFailed(session.message);
  else ctx.body = await userService.getById(session.id);
}
getByToken.validationScheme = {
  headers: yup.object({
    authorization: yup.string().required().test({
      name: 'check-token',
      skipAbsent: false,
      test(value) {
        if(!value) throw ServiceError.unauthorized("You need to be signed in");
        else if(!value.startsWith('Bearer ')) throw ServiceError.validationFailed("Invalid authentication token");
        return true;
      }
    })
  })
}

module.exports = (router) => {
  const prefix = "/api/users";

  const requireAdmin = makeRequireRole();

  router.get(prefix, requireAuthentication, requireAdmin, getAll);
  router.get(`${prefix}/count`, requireAuthentication, requireAdmin, countAll);
  router.get(`${prefix}/token`, requireAuthentication, validate(getByToken.validationScheme), getByToken);
  router.get(`${prefix}/:id`, requireAuthentication, validate(getById.validationScheme), getById);
  router.put(`${prefix}/:id`, requireAuthentication, validate(update.validationScheme), update);
  router.post(`${prefix}/login`, validate(login.validationScheme), login);
  router.post(`${prefix}`, validate(register.validationScheme), register);
}