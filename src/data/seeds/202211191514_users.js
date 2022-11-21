const { tables } = require('../index');

module.exports = {
	seed: async (knex) => {
		// first delete all entries
		await knex(tables.user).delete();

		// then add the fresh users (all passwords are 12345678)
		await knex(tables.user).insert([
			{
				Username: 'Thomas Aelbrecht',
				Email: 'thomas.aelbrecht@hogent.be',
				Password:
				'$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
				isAdmin: 1,
			},
			{
				Username: 'Pieter Van Der Helst',
				Email: 'pieter.vanderhelst@hogent.be',
				Password:
				'$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
				isAdmin: 0,
			},
			{
				Username: 'Karine Samyn',
				Email: 'karine.samyn@hogent.be',
				Password:
				'$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
				isAdmin: 0,
			},
		]);
	},
};