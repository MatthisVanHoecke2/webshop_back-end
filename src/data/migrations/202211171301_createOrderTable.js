module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('order', (table) => {
      table.increments('OrderID');
      table.integer('UserID', 10)
        .unsigned()
        .references('UserID')
        .inTable('user');
      table.date('Date');
      table.string('Status', 15);
      table.primary(['OrderID', 'UserID']);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('order');
  }
}