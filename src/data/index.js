const config = require('config');
const NODE_ENV = config.get('env');
const knex = require('knex');
const { join } = require('path');
const { getLogger } = require('../core/logging');

let knexInstance;

const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

async function initializeData() {
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    migrations: {
      tableName: 'knex_meta',
      directory: join('src', 'data', 'migrations')
    },
    seeds: {
      directory: join('src', 'data', 'seeds')
    }
  }
  knexInstance = knex(knexOptions);

  const logger = getLogger();

  try {
    await knexInstance.migrate.latest();
  }
  catch (err) {
    logger.error('Error while migrating the database', {
      err
    });

    throw new Error('Migrations failed, check the logs');
  }

  // try {
  //   await knexInstance.seed.run();
  // }
  // catch(err) {
  //   logger.error('Error while seeding the database', {
  //     err
  //   });

  //   throw new Error('Seeding failed, check the logs');
  // }
  // => commented to prevent deletion of all existing records

  try {
    await knexInstance.raw('SELECT 1+1 AS result');
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

    // We need to update the Knex configuration and reconnect to use the created database by default
    // USE ... would not work because a pool of connections is used
    await knexInstance.destroy();

    knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw('SELECT 1+1 AS result');
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error('Could not initialize the data layer');
  }
}

async function shutdownData() {
  const logger = getLogger();

  logger.info('Shutting down database connection');

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}

function getKnex() {
  if(!knexInstance) throw new Error('Please initialize the data layer before getting the Knex instance');
  return knexInstance;
}

const tables = Object.freeze({
  article: 'article',
  orderline: 'orderline',
  order: 'order',
  user: 'user',
  background: 'background',
  portrait: 'portrait'
})

module.exports = {
  initializeData,
  shutdownData,
  getKnex,
  tables
}