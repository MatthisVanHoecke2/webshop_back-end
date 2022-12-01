const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatOrder = ({ OrderID, UserID, Date, Status }) => ({
  order: OrderID,
  user: UserID,
  date: Date,
  status: Status
});

const getAll = async () => {
  const order = await getKnex()(tables.order)
    .select()
    .orderBy('date', 'desc');
  return order.map(formatOrder);
}

const countAll = async () => {
  const order = await getKnex()(tables.order)
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
  getRecent
}