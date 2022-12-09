const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');
const orderService = require('../service/orders');

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

const create = async (orderlines, order) => {
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

const update = async ({ id, order, status, price, character, imageUrl, detailed }) => {
  const data = { Status: status, PriceByOrder: price, CharacterAmount: character, ReferenceImageUrl: imageUrl, Detailed: detailed };
  
  if(!status) delete data["Status"];
  if(!price) delete data["OrderPrice"];
  if(!character) delete data["CharacterAmount"];
  if(!imageUrl) delete data["ReferenceImageUrl"];
  if(!detailed) delete data["Detailed"];

  try {
    await getKnex()(tables.orderline)
      .where('OrderlineID', id)
      .update(data)

    if(status && status !== 'In Queue') {
      const orderlines = await getByOrderId(order);
      
      let isDone = true;
      orderlines.forEach(el => {if(el.status !== 'Done') isDone = false});
      if(isDone) orderService.update({id: order, status: 'Done'});
      else orderService.update({id: order, status: 'In Progress'});
    }
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
  create,
  update
}