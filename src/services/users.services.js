class UsersService {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(queryParams = null) {
    return await this.dao.getAll();
  }

  async getById(id) {
    const product = await this.dao.getById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getByProperty(property, value) {
    const user = await this.dao.getByProperty(property, value);
    if (!user) throw new Error("Product not found");
    return user;
  }

  async create(user) {
    return await this.dao.create(user);
  }

  async update(id, user) {
    await this.dao.getById(id);
    return await this.dao.update(id, user);
  }

  async delete(id) {
    await this.dao.getById(id);
    return await this.dao.delete(id);
  }

  async setLastConnection(id) {
    const user = await this.dao.getById(id);
    await this.update(id, { last_connection: new Date().toLocaleString() });
    return user;
  }

  async addDocument(id, files) {
    const user = await this.dao.getById(id);
    let documents = user.documents || [];
    documents = [
      ...documents,
      ...files.map((file) => {
        return {
          name: file.originalname,
          reference: file.path.split("public")[1].replace(/\\/g, "/"),
        };
      }),
    ];
    return await this.update(id, { documents: documents });
  }
  async uploadProfilePicture(id, file) {
    await this.dao.getById(id);
    return await this.update(id, {
      profile_picture: file.path.split("public")[1].replace(/\\/g, "/"),
    });
  }
}

module.exports = UsersService;
