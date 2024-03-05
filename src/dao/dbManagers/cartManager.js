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

  async deleteProduct(id, itemId) {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.items = cart.items.filter((i) => i.item._id.toString() != itemId);
      await cartModel.updateOne({ _id: id }, cart);
      return cart;
    }
  }

  async updateCart(id, updatedProducts) {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.items = updatedProducts;
      await cartModel.updateOne({ _id: id }, cart);
      return cart;
    }
  }

  async updateQuantityProducts() {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.items = updatedProducts;
      productIndex = cart.items.findIndex(
        (i) => i.item._id.toString() == itemId
      );
      if (productIndex !== -1) {
        cart.items[productIndex].quantity = quantity;
        await cartModel.updateOne({ _id: id }, cart);
        return cart;
      } else {
        return {
          error: "Product not found in cart",
        };
      }
    }
  }

  async cleanCart(id) {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.items = [];
      await cartModel.updateOne({ _id: id }, cart);
      return cart;
    }
  }
}

module.exports = CartManager;
