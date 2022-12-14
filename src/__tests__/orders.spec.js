const service = require('../service/orders');
const repository = require('../repository/orders');
const each = require('jest-each').default;

describe('get all', () => {
  const orders = [
    {
      order: 1,
      user: 3,
      date: '2022-05-05 08:00:00',
      price: 22,
      status: 'In Queue'
    },
    {
      order: 2,
      user: 3,
      date: '2022-05-02 18:00:00',
      price: 22,
      status: 'In Progress'
    },
    {
      order: 3,
      user: 1,
      date: '2022-06-05 09:00:00',
      price: 22,
      status: 'Done'
    }
  ];

  it('should return all orders', async () => {
    repository.getAll = jest.fn().mockResolvedValue(orders);
    const data = await service.getAll();
    expect(data).toMatchObject({items: orders, count: orders.length});
    expect(repository.getAll).toHaveBeenCalled();
  });

  it('should return undefined when no orders are found', async () => {
    repository.getAll = jest.fn();
    const data = await service.getAll();
    expect(data).toMatchObject({items: undefined, count: 0});
    expect(repository.getAll).toHaveBeenCalled();
  });
});

describe('get by id', () => {
  each([
    [1, {
      order: 1,
      user: 3,
      date: '2022-05-05 08:00:00',
      price: 22,
      status: 'In Queue'
    },],
    [2, {
      order: 2,
      user: 3,
      date: '2022-05-05 18:00:00',
      price: 22,
      status: 'In Progress'
    },],
    [3, {
      order: 3,
      user: 1,
      date: '2022-06-10 20:00:00',
      price: 22,
      status: 'Done'
    },]
  ]).it('when the input is %s', async (input, expected) => {
    repository.getByOrderId = jest.fn().mockResolvedValue(expected);
    const data = await service.getByOrderId(input);
    expect(data).toMatchObject({items: expected, count: expected.length});
    expect(repository.getByOrderId).toHaveBeenCalled();
    expect(repository.getByOrderId).toHaveBeenCalledWith(input);
  });

  it('should return undefined when no order was found', async () => {
    repository.getByOrderId = jest.fn();
    const data = await service.getByOrderId(1);
    expect(data).toMatchObject({items: undefined, count: 0});
    expect(repository.getByOrderId).toHaveBeenCalled();
    expect(repository.getByOrderId).toHaveBeenCalledWith(1);
  });
});

describe('get by user id', () => {
  each([
    [
      3, {
      order: 1,
      user: 3,
      date: '2022-05-05 08:00:00',
      price: 22,
      status: 'In Queue'
      },
      {
        order: 2,
        user: 3,
        date: '2022-05-05 18:00:00',
        price: 22,
        status: 'In Progress'
      },
      {
        order: 2,
        user: 3,
        date: '2022-05-05 18:00:00',
        price: 22,
        status: 'In Progress'
      }
    ],
    [1, {
      order: 3,
      user: 1,
      date: '2022-06-10 20:00:00',
      price: 22,
      status: 'Done'
    },]
  ]).it('when the input is %s', async (input, expected) => {
    repository.getByUserId = jest.fn().mockResolvedValue(expected);
    const data = await service.getByUserId(input);
    expect(data).toMatchObject({items: expected, count: expected.length});
    expect(repository.getByUserId).toHaveBeenCalled();
    expect(repository.getByUserId).toHaveBeenCalledWith(input);
  });

  it('should return undefined when no order was found', async () => {
    repository.getByUserId = jest.fn();
    const data = await service.getByUserId(1);
    expect(data).toMatchObject({items: undefined, count: 0});
    expect(repository.getByUserId).toHaveBeenCalled();
    expect(repository.getByUserId).toHaveBeenCalledWith(1);
  });
});

describe('count', () => {
  it('should return the amount of all orders', async () => {
    repository.countAll = jest.fn().mockResolvedValue(6);
    const data = await service.countAll();
    expect(data).toEqual({count: 6});
  });

  it('should return the amount of all completed orders', async () => {
    repository.countCompleted = jest.fn().mockResolvedValue(3);
    const data = await service.countCompleted();
    expect(data).toEqual({count: 3});
  });

  it('should return the amount of all pending orders', async () => {
    repository.countPending = jest.fn().mockResolvedValue(3);
    const data = await service.countPending();
    expect(data).toEqual({count: 3});
  });
});

describe('get recent orders', () => {
  const orders = [
    {
      order: 1,
      user: 3,
      date: '2022-05-05 08:00:00',
      price: 22,
      status: 'In Queue'
    },
    {
      order: 2,
      user: 3,
      date: '2022-05-02 18:00:00',
      price: 22,
      status: 'In Progress'
    },
    {
      order: 3,
      user: 1,
      date: '2022-06-05 09:00:00',
      price: 22,
      status: 'In Queue'
    }
  ];
  it('should return all the latest orders', async () => {
    repository.getRecent = jest.fn().mockResolvedValue(orders);
    const data = await service.getRecent();
    expect(data).toMatchObject({items: orders, count: orders.length});
    expect(repository.getRecent).toHaveBeenCalled();
  });

  it('should return undefined when no orders are found', async () => {
    repository.getRecent = jest.fn();
    const data = await service.getRecent();
    expect(data).toMatchObject({items: undefined, count: 0});
    expect(repository.getRecent).toHaveBeenCalled();
  });
});

describe('create order', () => {
  const createData = {
    orderData: {
      order: 3,
      user: 1,
      date: '2022-06-05 09:00:00',
      price: 22,
      status: 'In Queue'
    },
    orderlinesData: {
      OrderID: 3,
      ArticleID: 2,
      UserDescription: "lorem ipsum dolor sit amet, consectetur",
      PriceByOrder: 12,
      CharacterAmount: 1,
      ReferenceImageUrl: "https://imageUrl.png",
      Status: "In Queue",
      Detailed: false
    }
  }

  const order = [{
    order: 3,
    user: 1,
    date: '2022-06-05 09:00:00',
    price: 22,
    status: 'In Queue'
  }];

  it('should create a new order', async () => {
    repository.create = jest.fn().mockResolvedValue(order);
    const data = await service.create(createData);
    expect(data).toMatchObject({items: order, count: order.length});
    expect(repository.create).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalledWith(createData);
  });

  it('should not create a new order if there is no order data', async () => {
    repository.create = jest.fn().mockResolvedValue(order);
    delete createData["orderData"];
    await expect(service.create(createData)).rejects.toThrow();
  });

  it('should not create a new order if there is no orderlines data', async () => {
    repository.create = jest.fn().mockResolvedValue(order);
    delete createData["orderlinesData"];
    await expect(service.create(createData)).rejects.toThrow();
  });
});

describe('update order', () => {
  const order = [{
    order: 3,
    user: 1,
    date: '2022-06-05 09:00:00',
    price: 22,
    status: 'In Queue'
  }];

  it('should update order', async () => {
    repository.update = jest.fn().mockResolvedValue(order);
    const updateData = {id: 3, price: 22, status: 'In Queue'};
    const data = await service.update(updateData);
    expect(data).toMatchObject({items: order, count: order.length});
    expect(repository.update).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(updateData);
  });

  it('should not update an order if there is no data', async () => {
    repository.create = jest.fn();
    await expect(service.create()).rejects.toThrow();
  });
});

