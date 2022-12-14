const orderlinesRepository = require('../repository/orderlines');

const getAll = async () => {
  const items = await orderlinesRepository.getAll();
  return {items: items, count: items ? items.length : 0};
}

const getById = async (id) => {
  const items = await orderlinesRepository.getById(id);
  return {items: items, count: items ? items.length : 0};
}

const getByOrderId = async (id) => {
  const items = await orderlinesRepository.getByOrderId(id);
  return {items: items, count: items ? items.length : 0};
}

const update = async (updateData) => {
  const items = await orderlinesRepository.update(updateData);
  return {items: items, count: items ? items.length : 0};
}

const create = async (data) => {
  const items = await orderlinesRepository.create(data);
  return {items: items, count: items ? items.length : 0};
}

module.exports = {
  getAll,
  getById,
  getByOrderId,
  update,
  create
};