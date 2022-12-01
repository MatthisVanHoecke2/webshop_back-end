module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('user', (table) => {
      table.increments('UserID');
      table.string('Username', 32).notNullable();
      table.string('Email', 64).notNullable();
      table.string('Password', 128).notNullable();
      table.smallint('isAdmin', 1).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('user');
  }
}