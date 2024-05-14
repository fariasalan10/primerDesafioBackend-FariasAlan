const CustomError = require("../../utils/errorHandling/customError");
const ErrorTypes = require("../../utils/errorHandling/errorTypes");

const fs = require("fs").promises;
class ProductManager {
  static id = 0;
  constructor(path) {
    this.path = path;
    fs.writeFile(path, "[]");
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
        throw new CustomError({
          name: "Product already exists",
          cause: "Product already exists",
          message: "Product already exists. Try another code",
          code: ErrorTypes.INVALID_PARAMETERS,
        });
      }

      const newProduct = {
        id: ++ProductManager.id,
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

module.exports = ProductManager;
