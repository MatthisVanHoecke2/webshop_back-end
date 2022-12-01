module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('article', (table) => {
      table.increments('ArticleID');
      table.string('Name', 20).notNullable();
      table.double('Price', 10).notNullable();
      table.string('ImageUrl', 255).notNullable();
      table.string('Description', 250).notNullable();
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('article');
  }
}