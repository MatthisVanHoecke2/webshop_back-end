module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('order', (table) => {
      table.increments('OrderID');
      table.integer('UserID', 10)
        .unsigned()
        .references('UserID')
        .inTable('user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.date('Date');
      table.double('OrderPrice');
      table.string('TransactionStatus', 15);
      table.primary(['OrderID', 'UserID']);
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('order');
  }
}