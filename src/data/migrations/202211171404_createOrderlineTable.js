module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('orderline', (table) => {
      table.integer('OrderID', 10)
        .unsigned()
        .references('OrderID')
        .inTable('order');
      table.integer('UserID', 10)
        .unsigned()
        .references('UserID')
        .inTable('order');
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article');
      table.string('UserDescription', 300);
      table.integer('PriceByOrder', 10);
      table.smallint('CharacterAmount', 1);
      table.string('ReferenceImageUrl', 200);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('orderline');
  }
}