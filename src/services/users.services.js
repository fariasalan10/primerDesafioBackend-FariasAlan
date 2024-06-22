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

  async changeRole(userId) {
    const user = await this.getById(userId);

    const requiredDocuments = [
      "Identificacion",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];

    if (user.role === "usuario") {
      if (!user.documents.some((d) => d.name.includes("Identificacion"))) {
        throw new Error("Missing required document: Identificacion");
      }
      if (
        !user.documents.some((d) => d.name.includes("Comprobante de domicilio"))
      ) {
        throw new Error("Missing required document: Comprobante de domicilio");
      }
      if (
        !user.documents.some((d) =>
          d.name.includes("Comprobante de estado de cuenta")
        )
      ) {
        throw new Error(
          "Missing required document: Comprobante de estado de cuenta"
        );
      }
    }

    if (!["usuario", "premium"].includes(user.role)) {
      throw new Error("Invalid role");
    }
    if (user.role === "usuario") {
      user.role = "premium";
    } else {
      user.role = "usuario";
    }
    await this.update(user._id.toString(), {
      $set: { role: user.role },
    });
  }
}

module.exports = UsersService;
