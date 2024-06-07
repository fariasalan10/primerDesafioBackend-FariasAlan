const chai = import("chai");
const supertest = require("supertest");

const request = supertest("http://localhost:8080");

describe("/api/products Test", () => {
  before(() => {
    this.productMock = {
      title: "test",
      description: "test",
      price: 1000,
      thumbnail: "imgtest.jpg",
      code: "test",
      stock: 100,
      status: true,
    };
    this.updateProductMock = {
      title: "testUpdated",
      description: "testUpdated",
      price: 2000,
      thumbnail: "imgtestupdate.jpg",
      code: "testupd",
      stock: 200,
      status: true,
    };
  });

  it("Al hacer un GET, deberia retornar un array de productos", async () => {
    const response = await request.get("/api/products");
    (await chai).expect(response.status).to.be.equal(200);
    (await chai).expect(response.body).to.be.deep.equal({
      status: "success",
      payload: (await chai).expect.any(Array),
    });
  });

  it("Al hacer un POST, deberia crear un producto", async () => {
    const response = await request.post("/api/products").send(this.productMock);
    (await chai).expect(response.status).to.be.equal(200);
    (await chai).expect(response.body).to.be.deep.equal({
      status: "success",
      message: "Product created",
      payload: (await chai).expect.any(Object),
    });
  });

  it("Al hacer un DELETE, deberia borrar un producto", async () => {
    const response = await request
      .delete("/api/products")
      .send(this.productMock);
    (await chai).expect(response.status).to.be.equal(200);
    (await chai).expect(response.body).to.be.deep.equal({
      status: "success",
      message: "Product deleted",
    });
  });

  it("Al hacer un PUT, deberia modificar un producto por ID", async () => {
    const response = await request.post("/api/products").send(this.productMock);
    const productId = response.body.payload._id;
    const response2 = await request
      .put(`/api/products/${productId}`)
      .send(this.updateProductMock);
    (await chai).expect(response2.status).to.be.equal(200);
    (await chai).expect(response2.body).to.be.deep.equal({
      status: "success",
      message: "Product updated",
      payload: (await chai).expect.any(Object),
    });
  });

  it("Al hacer un GET, deberia retornar un producto por ID", async () => {
    const response = await request.post("/api/products").send(this.productMock);
    const productId = response.body.payload._id;
    const response2 = await request.get(`/api/products/${productId}`);
    (await chai).expect(response2.status).to.be.equal(200);
    (await chai).expect(response2.body).to.be.deep.equal({
      status: "success",
      payload: (await chai).expect.any(Object),
    });
  });
});
