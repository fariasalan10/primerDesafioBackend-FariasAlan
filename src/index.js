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
  async getProducts() {
    try {
      const arrayProductos = this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
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
      const data = JSON.stringify(arrayProductos, null, 2);
      await fs.writeFile(this.path, data + "\n"); // Agregar un salto de línea al final
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  async updateProduct(id, updatedProperties) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((product) => product.id === id);

      if (index !== -1) {
        const existingProduct = arrayProductos[index];

        // Validar y actualizar propiedades
        for (const key in updatedProperties) {
          if (
            updatedProperties.hasOwnProperty(key) &&
            existingProduct.hasOwnProperty(key)
          ) {
            existingProduct[key] = updatedProperties[key];
          }
        }

        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado correctamente");
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}`);
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
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado correctamente");
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}`);
      }
    } catch (error) {
      console.log("Error al borrar el producto", error);
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
