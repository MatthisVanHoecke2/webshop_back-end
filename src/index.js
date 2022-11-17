
const config = require('config');
const { initializeLogger } = require('./core/logging');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
initializeLogger({
  level: LOG_LEVEL,
  disabled: LOG_DISABLED,
  defaultMeta: NODE_ENV
});

const { initializeData } = require('./data/index');
const { start } = require('./createServer');

async function main() {
  await initializeData();
}
main();

start();