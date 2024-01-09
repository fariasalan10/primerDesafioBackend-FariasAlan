class ProductManager {
  static id = 0;
  constructor() {
    this.products = [];
  }
  addProduct(title, description, price, thumbnail, code, stock) {
    const productoExistente = this.products.find(
      (product) => product.code === code
    );
    if (productoExistente != undefined) {
      console.log("El producto ya existe");
      return;
    } else {
      const newProduct = {
        id: ++ProductManager.id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      };
      this.products.push(newProduct);
      console.log("Se agrego el producto");
    }
  }
  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product !== undefined) {
      return product;
    } else {
      console.log("Not found");
      return null;
    }
  }
}

const pm = new ProductManager();

pm.addProduct("Product 1", "Description 1", 10, "image 1", "abc123", 5);
pm.addProduct("Product 2", "Description 2", 20, "image 2", "abc124", 10);
pm.addProduct("Product 3", "Description 3", 30, "image 3", "abc125", 15);

console.log(pm.getProducts());

const productoBuscado = pm.getProductsById(2);
const productoBuscado2 = pm.getProductsById(4);

console.log("El producto buscado es el siguiente: ", productoBuscado);
console.log("El producto buscado es el siguiente: ", productoBuscado2);
