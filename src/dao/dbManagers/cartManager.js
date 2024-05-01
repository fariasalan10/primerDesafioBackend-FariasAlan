const cartModel = require("../models/cart");

class CartManager {
  async addCart() {
    const cart = { products: [] };
    await cartModel.create(cart);
  }

  async getCart(id) {
    const cart = await cartModel.find({ _id: id }).populate("products.product")
      .lean;
    if (!cart || cart.length == 0) {
      throw new Error("cart no existe");
    }
    return cart[0];
  }

  async addProduct(id, productId) {
    const cart = await this.getCart(id);

    const index = cart.products.findIndex((i) => i.product._id == productId);
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProduct(id, productId) {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.products = cart.products.filter((i) => i.product._id != productId);
      await cartModel.updateOne({ _id: id }, cart);
      return this.getCart;
    }
  }

  async updateCart(id, updatedProducts) {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.products = updatedProducts;
      await cartModel.updateOne({ _id: id }, cart);
      return this.getCart(cartId);
    }
  }

  async updateQuantityProducts() {
    const cart = await this.getCart(id);
    if (!cart) {
      return;
    } else {
      cart.products = updatedProducts;
      productIndex = cart.products.findIndex(
        (i) => i.product._id.toString() == productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
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
      cart.products = [];
      await cartModel.updateOne({ _id: id }, cart);
      return cart;
    }
  }
}

module.exports = CartManager;
