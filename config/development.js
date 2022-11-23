module.exports = {
  log: {
    level: 'silly',
    disabled: false
  },

  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60
  },

  database: {
    client: 'mysql2',
    host: 'vichogent.be',
    port: 40043,
    name: '181703mv',
    username: '181703mv',
    password: '9AWKej2Ii1cklUnyvk3v'
  },

  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'ditiseensecretdieveeltemoeilijkisomteradenalshetgeradenwordtdanisdesitegehacked',
      expirationInterval: 60*60*1000,
      issuer: 'deewatter.webshop.com',
      audience: 'deewatter.webshop.com'
    }
  }
}