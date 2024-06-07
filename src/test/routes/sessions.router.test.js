const chai = import("chai");
const supertest = require("supertest");
const mongoose = require("mongoose");

const request = supertest("http://localhost:8080");

mongoose
  .connect(
    "mongodb+srv://fariasalan:Yy0i1kxIkMb8Ywdn@coderhousecluster.n7taqlj.mongodb.net/ecommerce"
  )
  .then(() => {
    console.log("MongoDB connected to test sessions router");
  });

describe("/api/sessions Test", () => {
  before(async () => {
    this.userMock = {
      first_name: "ALAN",
      last_name: "FARIAS",
      email: "TEST@TEST.COM",
      age: 25,
      password: "1234",
    };
    this.cookie;
    this.unprotectedCookie;

    await mongoose.connection.collections.users.drop();
  });

  it("Al hacer un POST, deberia crear un usuario", async () => {
    const response = await request
      .post("/api/sessions/register")
      .send(this.userMock);
    (await chai).expect(response.status).to.be.equal(200);
    (await chai).expect(response.body).to.exist;
  });

  it("Al hacer un POST, deberia loguear un usuario ya registrado", async () => {
    const loginMock = {
      email: this.userMock.email,
      password: this.userMock.password,
    };
    const response = await request.post("/api/sessions/login").send(loginMock);
    const cookie = response.headers["set-cookie"][0];
    const cookieSplit = cookie.split("=");
    this.cookie = {
      name: cookieSplit[0],
      value: cookieSplit[1],
    }(await chai)
      .expect(this.cookie)
      .to.exist(await chai)
      .expect(this.cookie.value).to.exist;
  });

  it("Al hacer un GET, deberia retornar un usuario logueado (current)", async () => {
    const response = await request
      .get("/api/sessions/current")
      .set("Cookie", this.cookie.value);
    (await chai).expect(response.status).to.be.equal(200);
    (await chai)
      .expect(response.body)
      .to.exist(await chai)
      .expect(response.body.payload)
      .to.exist(await chai)
      .expect(response.body.payload.email)
      .to.equal(this.userMock.email);
  });
});
