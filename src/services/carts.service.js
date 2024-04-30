class CartsService {
  constructor(dao, productsService, ticketService) {
    this.dao = dao;
    this.productsService = productsService;
    this.ticketService = ticketService;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    const cart = await this.dao.getById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  async create() {
    return await this.dao.create({ products: [] });
  }

  async update(id, product) {
    await this.getById(id);
    return await this.dao.update(id, product);
  }

  async delete(id) {
    await this.getById(id);
    return await this.dao.delete(id);
  }

  async addProduct(cartId, productId) {
    const cart = await this.getById(cartId);
    const index = cart.products.findIndex((p) => p.product == productId);
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await this.update(cartId, cart);
    return;
  }

  async deleteProductById(cartId, productId) {
    const cart = await this.getById(cartId);
    await this.productsService.getById(productId);

    const newContent = cart.products.filter((p) => p.product != productId);
    await this.update(cartId, { products: newContent });
    return this.getById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getById(cartId);
    await this.productsService.getById(productId);

    if (!quantity || quantity < 0 || isNaN(quantity)) {
      throw new Error("Invalid quantity");
    }

    const productInCartIndex = cart.products.findIndex(
      (p) => p.product == productId
    );
    if (productInCartIndex < 0) {
      throw new Error("Product not found in cart");
    }
    cart.products[productInCartIndex].quantity = parseInt(quantity);

    await this.update(cartId, cart);
    return this.getById(cartId);
  }

  async deleteAllProducts(cartId) {
    await this.getById(cartId);
    await this.update(cartId, { products: [] });
    return this.getById(cartId);
  }

  async purchase(cartId, userEmail) {
    const cart = await this.getById(cartId);

    const notPurchasedIds = [];
    let totalAmount = 0;
    for (let i = 0; i < cart.product.length; i++) {
      const product = cart.products[i];
      const remainder = product.product.stock - product.quantity;
      if (remainder >= 0) {
        await this.productsService.update(product.product._id, {
          ...product.product,
          stock: remainder,
        });
        await this.deleteProductById(cartId, product.product._id.toString());
        totalAmount += product.quantity * product.product.price;
      } else {
        notPurchasedIds.push(product.product._id);
      }
    }

    if (totalAmount > 0) {
      await this.ticketService.generate(userEmail, totalAmount);
      //await mailingService.sendPurchaseMail(req.user.email);
    }

    return notPurchasedIds;
  }
}

module.exports = CartsService;
