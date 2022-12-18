const ServiceError = require('../core/serviceError');
const orderRepository = require('../repository/orders');

const getAll = async () => {
  const items = await orderRepository.getAll();
  return {items: items, count: items ? items.length : 0};
}

const getByOrderId = async (id) => {
  const items = await orderRepository.getByOrderId(id)
  return { items: items, count: items ? items.length : 0 };
}

const getByUserId = async (id) => {
  const items = await orderRepository.getByUserId(id);
  return { items: items, count: items ? items.length : 0};
}

const countAll = async () => {
  const count = await orderRepository.countAll();
  return count;
}

const getRecent = async () => {
  const items = await orderRepository.getRecent();
  return { items: items, count: items ? items.length : 0};
}

const countCompleted = async () => {
  const count = await orderRepository.countCompleted();
  return count;
}

const countPending = async () => {
  const count = await orderRepository.countPending();
  return count;
}

const create = async (data) => {
  if(!data.orderData || !data.orderlinesData) throw ServiceError.validationFailed('You must provide enough data to create a new order');
  const items = await orderRepository.create(data);
  return { items: items, count: items ? items.length : 0};
}

const update = async (data) => {
  if(!data) throw ServiceError.validationFailed('You must provide enough data to update an order');
  const items = await orderRepository.update(data);
  return { items: items, count: items ? items.length : 0};
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