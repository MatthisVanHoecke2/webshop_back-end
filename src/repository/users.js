const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatUser = ({ UserID, Username, Email, Password, isAdmin }) => ({
  id: UserID,
  name: Username,
  email: Email,
  password: Password,
  isAdmin: isAdmin === 1 ? true : false
});

const countAll = async () => {
  const user = await getKnex()(tables.user)
    .count({count: '*'});
  return user[0];
}

const getAll = async () => {
  const user = await getKnex()(tables.user)
    .select();
  return user.map(formatUser);
}
const getById = async (id) => {
  const user = await getKnex()(tables.user)
    .select()
    .where('UserID', id);
  return user.map(formatUser)[0];
}
const getByEmailOrUsername = async ({name, email}) => {
  const user = await getKnex()(tables.user)
    .select()
    .whereRaw('LOWER(Email) = ? OR LOWER(Username) = ?', [email ? email.toLowerCase() : name.toLowerCase(), name.toLowerCase()]);
  return user.map(formatUser)[0];
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
const update = async ({ id, name, email, password }) => {
  let data = { Username: name, Email: email, Password: password };

  if(!name) delete data["Username"];
  if(!email) delete data["Email"];
  if(!password) delete data["Password"];
  
  try {
    await getKnex()(tables.user)
      .where('UserID', id)
      .update(data);
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
  update,
  countAll
}