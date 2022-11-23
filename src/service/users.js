const userRepository = require("../repository/users");
const { verifyPassword, hashPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");

const getAll = async () => {
  const items = await userRepository.getAll();
  return {items: items, count: items.length};
}
const getById = async (id) => {
  const items = await userRepository.getById(id);
  return {items: items, count: items.length};
}
const update = async (updateData) => {
  const items = await userRepository.update(updateData);
  return {items: items, count: items.length};
}

const register = async ({name, email, password}) => {
  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({name, email, passwords: passwordHash, isAdmin: false});

  return await makeLoginData(user);
}

const makeExposedUser = ({ id, name, email, isAdmin }) => ({
  id, name, email, isAdmin
});
const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token
  }
}
const login = async (nameOrEmail, password) => {
  const user = await userRepository.getByEmailOrUsername(nameOrEmail);

  if(!user) {
    throw new Error("The given user and password do not match");
  }
  const passwordValid = await verifyPassword(password, user.password);

  if(!passwordValid) {
    throw new Error("The given user and password do not match");
  }

  return await makeLoginData(user);
}

const checkAndParseSession = async (authHeader) => {
  if(!authHeader) {
    throw new Error("You need to be signed in");
  }

  if(!authHeader.startsWith('Bearer ')) {
    throw new Error("Invalid authentication token");
  }

  const authToken = authHeader.substr(7);
  try {
    const {isAdmin, id} = await verifyJWT(authToken);
    return { id, isAdmin, authToken };
  }
  catch(error) {
    const logger = getLogger();
    logger.error(error.message, { error });
		throw new Error(error.message);
  }
}
const checkRole = (isAdmin) => {
  const hasPermission = isAdmin === true;

  if(!hasPermission) {
    throw new Error("You are not allowed to view this part of the application");
  }
}

module.exports = {
  getAll,
  getById,
  login,
  register,
  update,
  checkAndParseSession,
  checkRole
}