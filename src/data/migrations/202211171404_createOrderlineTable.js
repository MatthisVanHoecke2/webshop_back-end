module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('orderline', (table) => {
      table.integer('OrderID', 10)
        .unsigned()
        .references('OrderID')
        .inTable('order')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('UserID', 10)
        .unsigned()
        .references('UserID')
        .inTable('order')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('Status', 15);
      table.string('UserDescription', 300);
      table.double('PriceByOrder');
      table.smallint('CharacterAmount', 1);
      table.string('ReferenceImageUrl', 200);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('orderline');
  }
}