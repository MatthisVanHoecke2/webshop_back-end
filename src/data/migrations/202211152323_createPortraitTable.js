module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('portrait', (table) => {
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article');
      table.integer('ExtraCharacterPrice', 10);
      table.string('Type', 10);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('portrait');
  }
}