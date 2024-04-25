const CartsDao = require("../dao/carts.dao");
const ItemsService = require("./products.service");

class CartsService {
  constructor() {
    this.dao = new CartsDao();
    this.itemsService = new ItemsService();
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

  async addItem(cartId, productId) {
    const cart = await this.getById(cartId);
    const index = cart.products.findIndex((p) => p.item == productId);
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ item: productId, quantity: 1 });
    }
    await this.update(cartId, cart);
    return;
  }

  async deleteItemById(cartId, productId) {
    const cart = await this.getById(cartId);
    await this.itemsService.getById(productId);

    const newContent = cart.products.filter((p) => p.item != productId);
    await this.update(cartId, { products: newContent });
    return this.getById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getById(cartId);
    await this.itemsService.getById(productId);

    if (!quantity || quantity < 0 || isNaN(quantity)) {
      throw new Error("Invalid quantity");
    }

    const productInCartIndex = cart.products.findIndex(
      (p) => p.item == productId
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
}

module.exports = CartsService;
