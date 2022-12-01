const orderRepository = require('../repository/orders');

const getAll = async () => {
  const items = await orderRepository.getAll();
  return { items: items, count: items.length};
}

const getByOrderId = async (id) => {
  const items = await orderRepository.getByOrderId(id)
  return { items: items, count: items.length};
}

const getByUserId = async (id) => {
  const items = await orderRepository.getByUserId(id);
  return { items: items, count: items.length};
}

const countAll = async () => {
  const items = await orderRepository.countAll();
  return { items: items };
}

const getRecent = async () => {
  const items = await orderRepository.getRecent();
  return { items: items, count: items.length };
}

module.exports = {
  getAll,
  getByOrderId,
  getByUserId,
  countAll,
  getRecent
}