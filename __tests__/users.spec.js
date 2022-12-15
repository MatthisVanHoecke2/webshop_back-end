const service = require('../src/service/users');
const repository = require('../src/repository/users');
const {hashPassword} = require('../src/core/password');

describe('update user', () => {
  const data = {password: 'password123*', name: 'TestUser', email: 'test@gmail.com'};

  it('should update the user', async () => {
    repository.getByEmailOrUsername = jest.fn();
    repository.update = jest.fn();
    await service.update(data);
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name, email: data.email});
    expect(repository.update).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(data);
  });

  it('should not update the user when user does not exist', async () => {
    repository.getByEmailOrUsername = jest.fn().mockResolvedValue({id: 1});
    repository.update = jest.fn();
    await expect(service.update(data)).rejects.toThrow();
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name, email: data.email});
  })
})

describe('register user', () => {
  const data = {id: 5, password: 'argon2idqdqzdqsjfogs##qdzq**', name: 'TestUser', email: 'test@gmail.com', isAdmin: false};

  it('should register the user and return exposed user', async () => {
    repository.getByEmailOrUsername = jest.fn();
    repository.create = jest.fn().mockResolvedValue(data);

    const loginData = await service.register(data);
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name, email: data.email});
    expect(loginData).toHaveProperty('user');
    expect(loginData).not.toHaveProperty('user.password');
    expect(loginData).toHaveProperty('user.id', data.id);
    expect(loginData).toHaveProperty('user.name', data.name);
    expect(loginData).toHaveProperty('user.email', data.email);
    expect(loginData).toHaveProperty('user.isAdmin', data.isAdmin);
    expect(loginData).toHaveProperty('token');
  });

  it("should not register the user when user already exists", async () => {
    repository.getByEmailOrUsername = jest.fn().mockResolvedValue({id: 1});
    repository.create = jest.fn();
    await expect(service.register(data)).rejects.toThrow();
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name, email: data.email});
  });
});

describe('log in user', () => {
  const data = {id: 1, password: 'password123*', name: 'TestUser', email: 'test@gmail.com', isAdmin: false};
  it("should log in the user", async () => {
    const hash = await hashPassword(data.password);
    repository.getByEmailOrUsername = jest.fn().mockResolvedValue({id: data.id, password: hash, name: data.name, email: data.email, isAdmin: data.isAdmin})

    const loginData = await service.login(data.name, data.password);
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name});
    expect(loginData).toHaveProperty('user');
    expect(loginData).not.toHaveProperty('user.password');
    expect(loginData).toHaveProperty('user.id', data.id);
    expect(loginData).toHaveProperty('user.name', data.name);
    expect(loginData).toHaveProperty('user.email', data.email);
    expect(loginData).toHaveProperty('user.isAdmin', data.isAdmin);
    expect(loginData).toHaveProperty('token');
  });

  it('should not log in the user when user name does not exist', async () => {
    repository.getByEmailOrUsername = jest.fn();
    await expect(service.login(data.name, data.password)).rejects.toThrow();
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name});
  });

  it('should not log in the user when user email does not exist', async () => {
    repository.getByEmailOrUsername = jest.fn()
    await expect(service.login(data.email, data.password)).rejects.toThrow();
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.email});
  });

  it('should not log in the user when password is not valid', async () => {
    repository.getByEmailOrUsername = jest.fn().mockResolvedValue({password: data.password})
    await expect(service.login(data.name, data.password)).rejects.toThrow();
    expect(repository.getByEmailOrUsername).toHaveBeenCalled();
    expect(repository.getByEmailOrUsername).toHaveBeenCalledWith({name: data.name});
  });
});
