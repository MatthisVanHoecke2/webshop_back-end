const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { getKnex, tables } = require('../../src/data');

describe('orders', () => {
  let server;
  let request;
  let knex;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/orders';

  describe('GET api/orders', () =>{
    beforeAll(async () => {
      await knex(tables.order).insert(data);
    });

    afterAll(async () => {
      await knex(tables.order)
        .whereIn('OrderID', dataToDelete.orders)
        .delete();
    });

    it('should 200 and return all orders', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(11);
      expect(response.body.items[0]).toHaveProperty('user');
      expect(response.body.items[0]).toHaveProperty('date');
      expect(response.body.items[0]).toHaveProperty('order');
      expect(response.body.items[0]).toHaveProperty('price');
      expect(response.body.items[0]).toHaveProperty('status');
    });

    it('should 200 and return the amount of orders', async () => {
      const response = await request.get(`${url}/count`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(11);
    });
    it('should 200 and return the amount of completed orders', async () => {
      const response = await request.get(`${url}/count/completed`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });
    it('should 200 and return the amount of pending orders', async () => {
      const response = await request.get(`${url}/count/pending`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(9);
    });

    it('should 200 and return order', async () => {
      const response = await request.get(`${url}/9`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });
    it('should 400 if id is invalid', async () => {
      const response = await request.get(`${url}/h`);
      expect(response.status).toBe(400);
    });

    it('should 200 and return orders', async () => {
      const response = await request.get(`${url}/user/3`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(4);
    });
    it('should 400 if user id is invalid', async () => {
      const response = await request.get(`${url}/user/h`);
      expect(response.status).toBe(400);
    });

    it('should 200 and return orders', async () => {
      const response = await request.get(`${url}/recent`);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(10);
    });
  });

  describe('POST api/orders', () => {
    const orderToDelete = [];

    afterAll(async () => {
      await knex(tables.order)
				.whereIn('OrderID', orderToDelete)
				.delete();
    });

    it('should 200 and return the created order', async () => {
      const response = await request.post(`${url}/create`)
        .send({
          orderData: {
            user: 3,
            price: 33
          },
          orderlinesData: 
          [
              {
              order: 12,
              article: 3,
              description: "lorem ipsum lorem ipsum lorem ipsum",
              price: 33,
              characters: 2,
              imageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
              status: 'In Queue',
              detailed: 0
            },
            {
              order: 12,
              article: 4,
              description: "lorem ipsum lorem ipsum lorem ipsum",
              price: 38,
              characters: 1,
              imageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
              status: 'In Queue',
              detailed: 1
            }
          ]
        });
      expect(response.status).toBe(200);
      
      const order = response.body.items[0];
      expect(order.order).toBe(12);
      expect(order.price).toBe(33);
      expect(order.status).toEqual('In Queue');

      orderToDelete.push(order.order);

    });

    it('should 400 and if data is invalid', async () => {
      const response = await request.post(`${url}/create`)
        .send({
          orderData: {
          },
          orderlinesData: 
          [
          ]
        });
      expect(response.status).toBe(400);

    });
  })

  describe('PUT api/orders', () => {
    const orderToDelete = [];

    beforeAll(async () => {
      await knex(tables.order).insert({
        UserID: 3,
        OrderPrice: 22,
      });
    });

    afterAll(async () => {
      await knex(tables.order)
        .whereIn('OrderID', orderToDelete)
        .delete();
    });

    it('should update the order', async () => {
      const response = await request.put(`${url}/update/13`)
        .send({
          status: 'In Progress',
          price: 33
        })
      
      expect(response.status).toBe(200);

      const order = response.body.items[0];
      expect(order.order).toBe(13);
      expect(order.price).toBe(33);
      expect(order.status).toEqual('In Progress');

      orderToDelete.push(order.order);
    })

    it('should 400 if order id is invalid', async () => {
      const response = await request.put(`${url}/update/h`)
      .send({
        status: 'In Progress',
        price: 33
      })
      expect(response.status).toBe(400);
    });

    it('should 400 if order data is invalid', async () => {
      const response = await request.put(`${url}/update/13`)
      .send({});
      expect(response.status).toBe(400);
    });
  });
});

const data = [
  {
    UserID: 3,
    OrderPrice: 22,
  },
  {
    UserID: 3,
    OrderPrice: 58,
  },
  {
    UserID: 1,
    OrderPrice: 95,
  }
]

const dataToDelete = {
  orders: [9, 10, 11]
}