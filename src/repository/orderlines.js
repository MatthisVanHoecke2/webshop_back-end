const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatOrderline = ({ OrderlineID, ArticleID, OrderID, UserDescription, PriceByOrder, CharacterAmount, ReferenceImageUrl, Status, Detailed }) => ({
  orderline: OrderlineID,
  article: ArticleID,
  order: OrderID,
  description: UserDescription,
  price: PriceByOrder,
  characters: CharacterAmount,
  detailed: Detailed,
  imageUrl: ReferenceImageUrl,
  status: Status
});

const getAll = async () => {
  const order = await getKnex()(tables.orderline)
    .select();
  return order.map(formatOrder);
}

const getById = async (id) => {
  const orderlines = await getKnex()(tables.orderline)
  	.select()
    .where('OrderlineID', id);
  return orderlines.map(formatOrderline)
}

const getByOrderId = async (id) => {
  const orderlines = await getKnex()(tables.orderline)
    .select()
    .where('OrderID', id);
  return orderlines.map(formatOrderline);
}

const update = async ({ id, status, price, character, imageUrl, detailed }) => {
  const data = { Status: status, OrderPrice: price, CharacterAmount: character, ReferenceImageUrl: imageUrl, Detailed: detailed };
  
  if(!status) delete data["Status"];
  if(!price) delete data["OrderPrice"];
  if(!character) delete data["CharacterAmount"];
  if(!imageUrl) delete data["ReferenceImageUrl"];
  if(!detailed) delete data["Detailed"];

  try {
    await getKnex()(tables.orderline)
      .where('OrderlineID', id)
      .update(data)
    return await getById(id);
  }
  catch(error) {
    const logger = getLogger();
    logger.error('Error in update', {error});
    throw error;
  }

}

module.exports = {
  getAll,
  getById,
  getByOrderId,
  update
}