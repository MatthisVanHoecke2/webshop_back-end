const {hashPassword, verifyPassword} = require('../core/password');

async function main() {
  const password = "good123doog";
  const wrongPassword = "bad321dab";
  console.log('The password: ', password);

  const hash = await hashPassword(password);
  console.log('The hash: ', hash);

  let isValid = await verifyPassword(password, hash);
  console.log('The password', password, ' is ', isValid ? 'valid' : 'incorrect');

  isValid = await verifyPassword(wrongPassword, hash);
  console.log('The password', wrongPassword, ' is ', isValid ? 'valid' : 'incorrect');
}

main();