class CartsService {
  constructor(dao, productService, ticketService) {
    this.dao = dao;
    this.productService = productService;
    this.ticketService = ticketService;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    try {
      const cart = await this.dao.getById(id);
      return cart;
    } catch (error) {
      throw new Error("Cart not found");
    }
  }

  async create(cart) {
    return await this.dao.create(cart);
  }

  async update(id, product) {
    const cart = await this.getById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return await this.dao.update(id, product);
  }

  async delete(id) {
    const cart = await this.getById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return await this.dao.delete(id);
  }

  async addProduct(cartId, productId) {
    const cart = await this.getById(cartId);
    const index = cart.products.findIndex(
      (i) => i.product._id.toString() == productId
    );

    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await this.update(cartId, cart);
    return cart;
  }

  async deleteProductById(cartId, productId) {
    const cart = await this.getById(cartId);
    await this.productService.getById(productId);

    const newContent = cart.products.filter(
      (p) => p.product._id.toString() != productId
    );
    await this.update(cartId, { products: newContent });
    return this.getById(cartId);
  }

  async updateCartProducts(cartId, content) {
    await this.getById(cartId);
    await this.update(cartId, { products: content });
    return this.getById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getById(cartId);
    await this.productService.getById(productId);

    if (!quantity || quantity < 0 || isNaN(quantity)) {
      throw new Error("Invalid quantity");
    }

    const productInCartIndex = cart.products.findIndex(
      (p) => p.product._id.toString() == productId
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
    const cart = await this.dao.getById(cartId);

    const notPurchasedIds = [];
    let totalAmount = 0;
    for (let i = 0; i < cart.products.length; i++) {
      const item = cart.products[i];
      const remainder = item.product.stock - item.quantity;
      if (remainder >= 0) {
        await this.productService.update(item.product._id, {
          ...item.product,
          stock: remainder,
        });
        await this.deleteProductById(cartId, item.product._id.toString());
        totalAmount += item.quantity * item.product.price;
      } else {
        notPurchasedIds.push(item.product._id);
      }
    }

    if (totalAmount > 0) {
      await this.ticketService.generate(userEmail, totalAmount);
    }

    return notPurchasedIds;
  }
}

module.exports = CartsService;
