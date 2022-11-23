const { tables } = require('../index');

module.exports = {
	seed: async (knex) => {
		// first delete all entries
		await knex(tables.article).delete();
		await knex.schema.raw(`ALTER TABLE ${tables.article} AUTO_INCREMENT = 1`);

		await knex(tables.article).insert([
			{
				Name: 'Background',
				Price: 14,
				ImageUrl:
				'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png',
				Description: "An artwork containing a detailed or blurry background",
			},
      {
				Name: 'Character',
				Price: 9,
				ImageUrl:
				'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png',
				Description: "An artwork containing a character",
			},
      {
				Name: 'Head',
				Price: 9,
				ImageUrl:
				'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png',
				Description: "An artwork containing a character's head",
			},
      {
				Name: 'Body',
				Price: 15,
				ImageUrl:
				'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png',
				Description: "An artwork containing a character's upper body",
			},
      {
				Name: 'Full Body',
				Price: 20,
				ImageUrl:
				'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png',
				Description: "An artwork containing a character's full body",
			},
		]);
    await knex(tables.background).insert([
      {
        ArticleID: 1,
        Detailed: 5
      }
    ])
    await knex(tables.portrait).insert([
      {
        ArticleID: 2,
        ExtraCharacterPrice: 5,
        Type: "base"
      },
      {
        ArticleID: 3,
        ExtraCharacterPrice: 5,
        Type: "head"
      },
      {
        ArticleID: 4,
        ExtraCharacterPrice: 7,
        Type: "body"
      },
      {
        ArticleID: 5,
        ExtraCharacterPrice: 10,
        Type: "fullbody"
      }
    ])
	},
};