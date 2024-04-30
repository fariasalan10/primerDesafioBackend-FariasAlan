class TicketService {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    const product = await this.dao.getById(id);
    if (!product)
      throw { message: `There's no ticket by id ${id}`, status: 400 };
    return product;
  }

  async create(product) {
    return await this.dao.create(product);
  }

  async update(id, product) {
    await this.dao.getById(id);
    return await this.dao.update(id, product);
  }

  async delete(id) {
    await this.dao.getById(id);
    return await this.dao.delete(id);
  }

  async generate(email, totalAmount) {
    const ticket = await this.dao.create({
      code: `${Math.random()}`,
      purchase_datetime: new Date().toLocaleString(),
      amount: totalAmount,
      purchaser: email,
    });

    return ticket;
  }
}

module.exports = TicketService;