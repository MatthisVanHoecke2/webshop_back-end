module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('article', (table) => {
      table.increments('ArticleID');
      table.string('Name', 20);
      table.integer('Price', 10);
      table.string('ImageUrl', 255);
      table.string('Description', 250);
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('article');
  }
}