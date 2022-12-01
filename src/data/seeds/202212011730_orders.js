const { tables } = require('../index');

module.exports = {
	seed: async (knex) => {
		// first delete all entries
		await knex(tables.order).delete();
		await knex.schema.raw(`ALTER TABLE \`${tables.order}\` AUTO_INCREMENT = 1`);

		// then add the fresh users (all passwords are 12345678)
		await knex(tables.order).insert([
			{
				UserID: 1,
				Date: '2022-12-01',
				OrderPrice: 66.00
			},
      {
				UserID: 1,
				Date: '2022-12-01',
				OrderPrice: 88.00
			},
      {
				UserID: 1,
				Date: '2022-12-01 18:00:00',
				OrderPrice: 111.00
			},
      {
				UserID: 1,
				Date: '2022-12-01',
				OrderPrice: 99.00
			},
      {
				UserID: 2,
				Date: '2022-12-01',
				OrderPrice: 66.00
			},
      {
				UserID: 2,
				Date: '2022-12-01',
				OrderPrice: 66.00
			},
      {
				UserID: 3,
				Date: '2022-12-01',
				OrderPrice: 66.00
			},
      {
				UserID: 3,
				Date: '2022-12-01 11:00:00',
				OrderPrice: 66.00
			},
		]);
	},
};