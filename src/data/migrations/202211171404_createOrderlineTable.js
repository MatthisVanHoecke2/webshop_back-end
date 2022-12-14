module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('orderline', (table) => {
      table.increments('OrderlineID')
      table.integer('OrderID', 10)
        .unsigned()
        .references('OrderID')
        .inTable('order')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('Status', 15)
        .defaultTo('In Queue')
        .notNullable();
      table.string('UserDescription', 300);
      table.double('PriceByOrder');
      table.smallint('CharacterAmount', 1);
      table.string('ReferenceImageUrl', 200);
      table.smallint('Detailed', 1);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('orderline');
  }
}