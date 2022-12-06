const articleRepository = require('../repository/articles');

const getAll = async () => {
  const items = await articleRepository.getAll();
  return { items: items, count: items.length };
}
const getById = async (id) => { 
  const items = await articleRepository.getById(id);
  return { items: items, count: items.length };
}
const getAllPortraits = async () => {
  const items = await articleRepository.getAllPortraits();
  return { items: items, count: items.length };
}
const getPortraitByType = async (type) => {
  const items = await articleRepository.getPortraitByType(type);
  return { items: items, count: items.length };
}

module.exports = {
  getAll,
  getById,
  getAllPortraits,
  getPortraitByType,
}