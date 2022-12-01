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
      table.datetime('Date').notNullable();
      table.double('OrderPrice').notNullable();
      table.string('Status', 15)
        .defaultTo('In Queue')
        .notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists('order');
  }
}