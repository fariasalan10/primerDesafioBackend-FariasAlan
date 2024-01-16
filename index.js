const fs = require("fs").promises;
class ProductManager {
  static id = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

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
      await this.guardarArchivo(this.products);
    }
  }
  getProducts() {
    return this.products;
  }

  async getProductsById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const product = arrayProductos.find((product) => product.id === id);
      if (product !== undefined) {
        return product;
      } else {
        console.log("Not found");
        return null;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async leerArchivo() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(data);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((product) => product.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("Not found");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((product) => product.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1);
      } else {
        console.log("Not found");
      }
    } catch (error) {
      console.log("Error al borrar el producto", error);
    }
  }
}

const pm = new ProductManager("./products.json");

pm.addProduct("Product 1", "Description 1", 10, "image 1", "abc123", 5);
pm.addProduct("Product 2", "Description 2", 20, "image 2", "abc124", 10);

console.log(pm.getProducts());

async function gerProductsById() {
  const productoBuscado = await pm.getProductsById(2);
  const productoBuscado2 = await pm.getProductsById(4);
  console.log("El producto buscado es el siguiente: ", productoBuscado);
  console.log("El 2do producto buscado  es el siguiente: ", productoBuscado2);
}
gerProductsById();

const newProduct = {
  id: 2,
  title: "Product 2 updated",
  description: "Description 2 updated",
  price: 30,
  thumbnail: "image 2 updated",
  code: "abc124 updated",
  stock: 15,
};

async function updateProduct() {
  await pm.updateProduct(2, newProduct);
  console.log("El producto actualizado es el siguiente: ", newProduct);
}
updateProduct();

async function deleteProduct() {
  await pm.deleteProduct(2);
  console.log("Producto eliminado");
}
deleteProduct();
