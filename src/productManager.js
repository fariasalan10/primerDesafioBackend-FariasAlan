const fs = require("fs").promises;
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async initialize() {
    try {
      await fs.access(this.path);
    } catch (error) {
      await fs.writeFile(this.path, "[]");
    }
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      // Validar entrada
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios");
      }

      const products = await this.getProducts();

      // Verificar si el producto ya existe
      const existingProduct = products.find((product) => product.code == code);
      if (existingProduct) {
        throw new Error("El producto ya existe");
      }

      const newProduct = {
        id: await this.getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      products.push(newProduct);
      await this.guardarArchivo(products);
      return newProduct;
    } catch (error) {
      console.log("Error al añadir producto:", error.message);
    }
  }
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo", error);
      return [];
    }
  }
  async getProductsById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id == id);
  }

  async getNextId() {
    const products = await this.getProducts();
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  async guardarArchivo(arrayProductos) {
    try {
      const data = JSON.stringify(arrayProductos, null, 2);
      await fs.writeFile(this.path, data + "\n"); // Agregar un salto de línea al final
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  async updateProduct(id, updatedProperties) {
    try {
      const products = await this.getProducts();

      const index = products.findIndex((product) => product.id == id);
      if (index !== -1) {
        const existingProduct = products[index];

        // Validar y actualizar propiedades
        for (const key in updatedProperties) {
          if (existingProduct.hasOwnProperty(key)) {
            existingProduct[key] = updatedProperties[key];
          }
        }

        await this.guardarArchivo(products);
        console.log("Producto actualizado correctamente");
        return existingProduct;
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}`);
        return null;
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();

      const index = products.findIndex((product) => product.id == id);
      if (index !== -1) {
        products.splice(index, 1);
        await this.guardarArchivo(products);
        console.log("Producto eliminado correctamente");
        return true;
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}`);
        return false;
      }
    } catch (error) {
      console.log("Error al borrar el producto", error);
      return false;
    }
  }
}

// const pm = new ProductManager("./src/products.json");

// pm.addProduct("Product 1", "Description 1", 10, "image 1", "abc123", 5);
// pm.addProduct("Product 2", "Description 2", 20, "image 2", "abc124", 10);
// pm.addProduct("Product 3", "Description 3", 30, "image 3", "abc125", 15);
// pm.addProduct("Product 4", "Description 4", 40, "image 4", "abc126", 20);
// pm.addProduct("Product 5", "Description 5", 50, "image 5", "abc127", 25);
// pm.addProduct("Product 6", "Description 6", 60, "image 6", "abc128", 30);
// pm.addProduct("Product 7", "Description 7", 70, "image 7", "abc129", 35);
// pm.addProduct("Product 8", "Description 8", 80, "image 8", "abc130", 40);
// pm.addProduct("Product 9", "Description 9", 90, "image 9", "abc131", 45);
// pm.addProduct("Product 10", "Description 10", 100, "image 10", "abc132", 50);

// async function getProductsById() {
//   const productoBuscado = await pm.getProductsById(2);
//   const productoBuscado2 = await pm.getProductsById(4);
//   console.log("El producto buscado es el siguiente: ", productoBuscado);
//   console.log("El 2do producto buscado  es el siguiente: ", productoBuscado2);
// }
// getProductsById();

// const newProduct = {
//   title: "Product 2 updated",
//   description: "Description 2 updated",
//   thumbnail: "image 2 updated",
//   code: "abc124 updated",
// };

// async function updateProduct() {
//   await pm.updateProduct(2, newProduct);
//   console.log("El producto actualizado es el siguiente: ", newProduct);
// }
// updateProduct();

// pm.getProducts();

// async function deleteProductById(id) {
//   await pm.deleteProduct(id);
//   console.log("Producto con ID", id, "eliminado correctamente");
// }

// deleteProductById(1);

module.exports = ProductManager;
