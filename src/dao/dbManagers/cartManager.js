const cartModel = require("../models/cart");

class CartManager {
  async addCart() {
    const cart = { items: [] };
    await cartModel.create(cart);
  }

  async getCart(id) {
    const cart = await cartModel.findOne({ _id: id });
    return cart;
  }

  async addProduct(id, itemId) {
    const cart = await this.getCart(id);

    const index = cart.items.findIndex((i) => i.item == itemId);
    if (index >= 0) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ item: itemId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: id }, cart);
  }
}
module.exports = CartManager;
