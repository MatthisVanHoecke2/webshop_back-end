module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('portrait', (table) => {
      table.integer('ArticleID', 10)
        .unsigned()
        .references('ArticleID')
        .inTable('article')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.double('ExtraCharacterPrice', 10).notNullable();
      table.string('Type', 10).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('portrait');
  }
}