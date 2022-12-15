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
  return order[0];
}

const countCompleted = async () => {
  const order = await getKnex()(tables.order)
  	.where('Status', 'Done')
    .count({count: '*'});
  return order[0];
}

const countPending = async () => {
  const order = await getKnex()(tables.order)
  	.whereNot('Status', 'Done')
    .count({count: '*'});
  return order[0];
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

const create = async ({orderData, orderlinesData}) => {
  try {
    const [id] = await getKnex()(tables.order)
      .insert({ UserID: orderData.user, OrderPrice: orderData.price});
    await createOrderlines(orderlinesData, id);
    return await getByOrderId(id);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in create', {error});
    throw error;
  }
}

const createOrderlines = async (orderlines, order) => {
  const formatInsert = (data) => ({
    OrderID: data.order ?? order,
    ArticleID: data.article,
    UserDescription: data.description,
    PriceByOrder: data.price,
    CharacterAmount: data.characters,
    ReferenceImageUrl: data.imageUrl,
    Status: data.status,
    Detailed: data.detailed
  });

  try {
    const orderlineArr = orderlines.map(formatInsert);
    await getKnex()(tables.orderline)
            .insert(orderlineArr);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in update', {error});
    throw error;
  }
}

const update = async ({ id, price, status }) => {
  let data = { OrderID: id, OrderPrice: price, Status: status };

  if(!price) delete data["OrderPrice"];
  if(!status) delete data["Status"];
  
  try {
    await getKnex()(tables.order)
      .where('OrderID', id)
      .update(data);
    return await getByOrderId(id);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in update', {error});
    throw error;
  }
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