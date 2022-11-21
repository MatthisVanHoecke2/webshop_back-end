const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatUser = ({ UserID, Username, Email, Password, isAdmin }) => ({
  id: UserID,
  name: Username,
  email: Email,
  password: Password,
  isAdmin: isAdmin === 1 ? true : false
});

const getAll = async () => {
  const user = await getKnex()(tables.user)
    .select();
  return user.map(formatUser);
}
const getById = async (id) => {
  const user = await getKnex()(tables.user)
    .select()
    .where('UserID', id);
  return user.map(formatUser);
}
const getByEmailOrUsername = async (input) => {
  const user = await getKnex()(tables.user)
    .select()
    .whereRaw('LOWER(Email) = LOWER(?) OR LOWER(Username) = LOWER(?)', input, input);
  return user.map(formatUser);
}
const create = async ({ name, email, password, isAdmin }) => {
  try {
    const [id] = await getKnex()(tables.user)
      .insert({ Username: name, Email: email, Password: password, isAdmin: isAdmin === true ? 1 : 0 });
    return await getById(id);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in create', {error});
    throw error;
  }
} 
const update = async ({ id, name, email, password, isAdmin }) => {
  try {
    await getKnex()(tables.user)
      .where('UserID', id)
      .update({ Username: name, Email: email, Password: password, isAdmin });
    return await getById(id);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in update', {error});
    throw error;
  }
}

module.exports = {
  getAll,
  getById,
  getByEmailOrUsername,
  create,
  update
}