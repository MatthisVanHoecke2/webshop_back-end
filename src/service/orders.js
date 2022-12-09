const orderRepository = require('../repository/orders');

const getAll = async () => {
  const items = await orderRepository.getAll();
  return {items: items, count: items.length};
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

const countCompleted = async () => {
  const items = await orderRepository.countCompleted();
  return { items: items };
}

const countPending = async () => {
  const items = await orderRepository.countPending();
  return { items: items};
}

const create = async (data) => {
  const items = await orderRepository.create(data);
  return { items: items, count: items.length};
}

const update = async (data) => {
  const items = await orderRepository.update(data);
  return { items: items, count: items.length};
}

module.exports = {
  getAll,
  getByOrderId,
  getByUserId,
  countAll,
  getRecent,
  countCompleted,
  countPending,
  create,
  update
}