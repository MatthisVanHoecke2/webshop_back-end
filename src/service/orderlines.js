const orderlinesRepository = require('../repository/orderlines');

const getAll = async () => {
  const items = await orderlinesRepository.getAll();
  return {items: items, count: items.length};
}

const getById = async (id) => {
  const items = await orderlinesRepository.getById(id);
  return {items: items, count: items.length};
}

const getByOrderId = async (id) => {
  const items = await orderlinesRepository.getByOrderId(id);
  return {items: items, count: items.length};
}

const update = async (updateData) => {
  const items = await orderlinesRepository.update(updateData);
  return {items: items, count: items.length};
}

module.exports = {
  getAll,
  getById,
  getByOrderId,
  update
};