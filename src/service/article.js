let { PRICEDATA } = require('../data/mock-data');
const articleRepository = require('../repository/article');

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

const create = ({amount, date, placeId, user}) => {
  throw new Error("not implemented yet");
}
const updateById = (id, {amount, date, placeId, user}) => {
  throw new Error("not implemented yet");
}
const deleteById = (id) => {
  throw new Error("not implemented yet");
}

module.exports = {
  getAll,
  getById,
  create,
  getAllPortraits,
  getPortraitByType,
  updateById,
  deleteById
}