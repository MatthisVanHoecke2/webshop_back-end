const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatOrder = ({ OrderID, UserID, OrderPrice, Date, Status }) => ({
  order: OrderID,
  user: UserID,
  date: Date,
  price: OrderPrice,
  status: Status
});

const getAll = async () => {
  const orders = await getKnex()(tables.order)
    .select()
    .orderBy('Date', 'desc');
  return orders.map(formatOrder);
}

const countAll = async () => {
  const order = await getKnex()(tables.order)
    .count({count: '*'});
  return order;
}

const countCompleted = async () => {
  const order = await getKnex()(tables.order)
  	.where('Status', 'Done')
    .count({count: '*'});
  return order;
}

const countPending = async () => {
  const order = await getKnex()(tables.order)
  	.whereNot('Status', 'Done')
    .count({count: '*'});
  return order;
}

const getRecent = async () => {
  const orders = await getKnex()(tables.order)
  	.select()
    .orderBy('Date', 'desc')
    .limit(10);
  return orders.map(formatOrder);
}

const getByOrderId = async (id) => {
  const order = await getKnex()(tables.order)
    .select()
    .where('OrderID', id);
  return order.map(formatOrder);
}

const getByUserId = async (id) => {
  const order = await getKnex()(tables.order)
    .select()
    .where('UserID', id);
  return order.map(formatOrder);
}

module.exports = {
  getAll,
  getByOrderId,
  getByUserId,
  countAll,
  getRecent,
  countCompleted,
  countPending
}