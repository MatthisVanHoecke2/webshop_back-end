module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('user', (table) => {
      table.increments('UserID');
      table.string('Username', 32);
      table.string('Email', 64);
      table.string('Password', 128);
      table.smallint('isAdmin', 1);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('user');
  }
}