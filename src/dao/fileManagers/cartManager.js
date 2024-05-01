const fs = require("fs").promises;
class CartManager {
  static id = 0;
  constructor(path) {
    this.path = path;
    fs.writeFile(path, "[]");
  }

  async addCart() {
    const content = await fs.readFile(this.path, "utf-8");
    const carts = JSON.parse(content);
    const cart = { id: ++CartManager.id, products: [] };
    carts.push(cart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
  }

  async getCart(id) {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
      const cart = carts.find((cart) => cart.id == id);
      return cart;
    } catch (error) {
      console.error("Error al leer el archivo de carritos:", error);
      throw new Error("Error al leer el archivo de carritos");
    }
  }

  async addProduct(id, productId) {
    const content = await fs.readFile(this.path, "utf-8"); //leemos archivo
    const carts = JSON.parse(content); //convertimos archivo en objeto javascript

    const col_index = carts.findIndex((i) => i.id == id); //buscamos un product con ese mismo id
    const newCart = { ...carts[col_index] };

    const index = newCart.products.findIndex((i) => i.product == productId);
    if (index >= 0) {
      newCart.products[index].quantity += 1;
    } else {
      newCart.products.push({ product: productId, quantity: 1 });
    }

    newCart[col_index] = newCart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, "\t")); //escribimos el archivo
  }
}
module.exports = CartManager;
