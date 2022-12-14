const articleRepository = require('../repository/articles');

const getAll = async () => {
  const items = await articleRepository.getAll();
  return { items: items, count: items ? items.length : 0};
}
const getById = async (id) => { 
  const items = await articleRepository.getById(id);
  return { items: items, count: items ? items.length : 0};
}
const getAllPortraits = async () => {
  const items = await articleRepository.getAllPortraits();
  return { items: items, count: items ? items.length : 0};
}
const getPortraitByType = async (type) => {
  const items = await articleRepository.getPortraitByType(type);
  return { items: items, count: items ? items.length : 0};
}

module.exports = {
  getAll,
  getById,
  getAllPortraits,
  getPortraitByType,
}