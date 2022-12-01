const { tables } = require('../index');

module.exports = {
	seed: async (knex) => {
		// first delete all entries
		await knex(tables.orderline).delete();
		await knex.schema.raw(`ALTER TABLE \`${tables.orderline}\` AUTO_INCREMENT = 1`);

		// then add the fresh users (all passwords are 12345678)
		await knex(tables.orderline).insert([
			{
				ArticleID: 1,
        OrderID: 1,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "In Queue"
			},
			{
				ArticleID: 1,
        OrderID: 1,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 1,
        OrderID: 1,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "In Progress"
			},
      {
				ArticleID: 1,
        OrderID: 1,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 1,
        OrderID: 1,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "In Progress"
			},
      {
				ArticleID: 2,
        OrderID: 2,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 4,
        OrderID: 2,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 3,
        OrderID: 2,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 2,
        OrderID: 3,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 4,
        OrderID: 3,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      {
				ArticleID: 3,
        OrderID: 3,
				PriceByOrder: 22.00,
        CharacterAmount: 2,
        ReferenceImageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        Status: "Done"
			},
      
		]);
	},
};