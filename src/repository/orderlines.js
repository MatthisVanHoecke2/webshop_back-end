const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatOrderline = ({ ArticleID, OrderID, UserID, UserDescription, PriceByOrder, CharacterAmount, ReferenceImageUrl, Status }) => ({
  article: ArticleID,
  order: OrderID,
  user: UserID,
  description: UserDescription,
  price: PriceByOrder,
  characterAmount: CharacterAmount,
  imageUrl: ReferenceImageUrl,
  status: Status
});

const getAll = async () => {
  const order = await getKnex()(tables.order)
    .select();
  return order.map(formatOrder);
}

const getByOrderId = async (id) => {
  const orderlines = await getKnex()(tables.orderline)
    .select()
    .where('OrderID', id);
  return orderlines.map(formatOrderline);
}

module.exports = {
  getAll,
  getByOrderId
}