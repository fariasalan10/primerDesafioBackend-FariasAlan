const socket = io();

const productTitle = document.getElementById("title");
const productDescription = document.getElementById("description");
const productPrice = document.getElementById("price");
const productThumbnail = document.getElementById("thumbnail");
const productCode = document.getElementById("code");
const productStock = document.getElementById("stock");
const idDivProducts = document.getElementById("divProducts");

const addProductButton = document.getElementById("addProduct");

addProductButton.addEventListener("click", () => {
  socket.emit("new product", {
    title: productTitle.value,
    description: productDescription.value,
    price: productPrice.value,
    thumbnail: productThumbnail.value,
    code: productCode.value,
    stock: productStock.value,
  });
  productTitle.value = "";
  productDescription.value = "";
  productPrice.value = "";
  productThumbnail.value = "";
  productCode.value = "";
  productStock.value = "";
});

socket.on("list updated", ({ products }) => {
  idDivProducts.innerHTML = "";
  products.forEach((product) => {
    idDivProducts.innerHTML += `
    <h2>${product.title}</h2>
    <p>Id: ${product.id}</p>
    <p>Description: ${product.description}</p>
    <p>Price: ${product.price}</p>
    <p>Img: ${product.thumbnail}</p>
    <p>Code: ${product.code}</p>
    <p>Stock: ${product.stock}</p>
    <button onclick="deleteProduct(${this.id})">Delete</button>`;
  });
});

function deleteProduct(id) {
  socket.emit("delete product", { id });
}
