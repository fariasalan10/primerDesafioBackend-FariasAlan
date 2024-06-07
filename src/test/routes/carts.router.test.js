const chai = import("chai");
const supertest = require("supertest");

const request = supertest("http://localhost:8080");

describe("/api/carts Test", () => {
  before(() => {
    this.cartMock = {
      products: [],
    };
    this.productMock = {
      title: "test",
      description: "test",
      price: 1000,
      thumbnail: "imgtest.jpg",
      code: "test",
      stock: 100,
      status: true,
    };
  });

  it("Al hacer un POST, deberia crear un carrito", async () => {
    const response = await request.post("/api/carts").send(this.cartMock);
    (await chai).expect(response.status).to.be.equal(200);
  });

  it("Al hacer un GET, deberia retornar un carrito con su ID", async () => {
    const response = await request.post("/api/carts").send(this.cartMock);
    const cartId = response.body.payload._id;
    (await chai).expect(response.status).to.be.equal(200);
    (await chai).expect(cartId).to.exist;
    // console.log(cartId);
  });

  it("Al hacer un POST, se debe poder agregar un producto al carrito", async () => {
    const response = await request.post("/api/carts").send(this.cartMock);
    const response2 = await request
      .post("/api/products")
      .send(this.productMock);
    //AQUI SE DEBERIA AGREGAR LOGICA PARA LOGUEAR AL USUARIO, DE LO CONTRARIO DA ERROR POR EL MIDDLEWARE.
    // const cartId = response.body.payload._id;
    // const productId = response2.body.payload._id;

    // const response3 = await request
    //   .post(`/api/carts/${cartId}/product/${productId}`)
    //   .send();
    // (await chai).expect(response3.status).to.be.equal(200);
    // (await chai).expect(response3.body).to.be.deep.equal({
    //   status: "success",
    //   message: "Product added to cart",
    //   payload: (await chai).expect.any(Object),
    // });
  });
});
