const userRepository = require("../repository/users");
const { verifyPassword, hashPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");
const { getLogger } = require("../core/logging");

const countAll = async () => {
  const items = await userRepository.countAll();
  return { items: items };
}
const getAll = async () => {
  const items = await userRepository.getAll();
  return {items: items, count: items.length};
}
const getById = async (id) => {
  const items = await userRepository.getById(id);
  return {items: items, count: items.length};
}
const update = async (updateData) => {
  if(updateData.password) {
    passwordHash = await hashPassword(updateData.password);
    updateData["password"] = passwordHash;
  }
  if(updateData.name && updateData.email) {
    const existingUser = await userRepository.getByEmailOrUsername({name: updateData.name, email : updateData.email});
    if(existingUser) throw new Error('User already exists');
  }


  const items = await userRepository.update(updateData);
  return {items: items, count: items.length};
}

const register = async ({name, email, password}) => {
  const existingUser = await userRepository.getByEmailOrUsername({name, email});

  if(existingUser) throw new Error('User already exists');

  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({name, email, password: passwordHash, isAdmin: false});

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
  const user = await userRepository.getByEmailOrUsername({name: nameOrEmail});

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
    const { userId, isAdmin } = await verifyJWT(authToken);
    return { id: userId, isAdmin, authToken };
  }
  catch(error) {
    const logger = getLogger();
    logger.error(error.message);
    return error;
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
  checkRole,
  countAll
}