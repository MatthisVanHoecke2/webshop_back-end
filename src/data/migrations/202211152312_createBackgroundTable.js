module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('background', (table) => {
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.double('Detailed');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('background');
  }
}