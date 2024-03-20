const { Router } = require("express");
const sessionRouter = Router();
const userModel = require("../dao/models/users");

sessionRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send({
      status: "error",
      message: "Missing required information",
    });
  }

  try {
    const result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    res.send({
      status: "success",
      message: "User created successfully",
      result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        status: "error",
        message: "User already exists",
      });
    }
    console.log("Error creating user", error);
    res.status(500).send("Error creating user");
  }
});

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", error: "Missing data" });
  }
  const result = await userModel.findOne({ email, password });

  if (!result) {
    return res.status(400).send({
      status: "error",
      error: "Wrong email or password",
    });
  }
  let role = "usuario";
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    role = "admin";
  }

  req.session.user = {
    name: `${result.first_name} ${result.last_name}`,
    email: result.email,
    age: result.age,
    role: role,
  };
  res.send({
    status: "success",
    message: "User logged in successfully",
    payload: req.session.user,
  });
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
      });
    }
  });
  res.redirect("/login");
});

module.exports = sessionRouter;
