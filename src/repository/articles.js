const { tables, getKnex } = require('../data/index');

const formatArticle = ({ArticleID, Name, Price, ImageUrl, Description, Detailed, ExtraCharacterPrice, Type, ...rest}) => ({
  ...rest,
  id: ArticleID,
  name: Name,
  price: Price,
  type: Type,
  imageUrl: ImageUrl,
  description: Description,
  extra: Detailed ? Detailed : ExtraCharacterPrice
});

const getAll = async () => {
  const article = await getKnex()(tables.article)
    .leftJoin(tables.background, `${tables.background}.ArticleID`, '=', `${tables.article}.ArticleID`)
    .leftJoin(tables.portrait, `${tables.portrait}.ArticleID`, '=', `${tables.article}.ArticleID`)
    .select(`${tables.article}.ArticleID`, 'Name', 'Price', 'ImageUrl', 'Description', 'ExtraCharacterPrice', 'Type', 'Detailed')
  return article.map(formatArticle);
}

const getById = async (id) => {
  const article = await getKnex()(tables.article)
    .leftJoin(tables.background, `${tables.background}.ArticleID`, '=', `${tables.article}.ArticleID`)
    .leftJoin(tables.portrait, `${tables.portrait}.ArticleID`, '=', `${tables.article}.ArticleID`)
    .select(`${tables.article}.ArticleID`, 'Name', 'Price', 'ImageUrl', 'Description', 'ExtraCharacterPrice', 'Type', 'Detailed')
    .where(`${tables.article}.ArticleID`, id);
  return article.map(formatArticle);
}

const getAllPortraits = async () => {
  const article = await getKnex()(tables.article)
    .join(tables.portrait, `${tables.portrait}.ArticleID`, '=', `${tables.article}.ArticleID`);
  return article.map(formatArticle);
}

const getPortraitByType = async (type) => {
  const article = await getKnex()(tables.article)
    .join(tables.portrait, `${tables.portrait}.ArticleID`, '=', `${tables.article}.ArticleID`)
    .where(`${tables.portrait}.Type`, type);
  return article.map(formatArticle);
}

module.exports = {
  getAll,
  getById,
  getAllPortraits,
  getPortraitByType,
}