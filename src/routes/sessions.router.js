const { Router } = require("express");
const sessionRouter = Router();
const userModel = require("../dao/models/users");
const passport = require("passport");
const { createHash } = require("../utils");

sessionRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failRegister" }),
  async (req, res) => {
    res.send({
      status: "success",
      message: "User created successfully",
    });
  }
);

sessionRouter.get("/failRegister", (req, res) => {
  alert("User already exists");
  res.status(400).send({
    status: "error",
    message: "Missing required information",
  });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failLogin",
  }),
  async (req, res) => {
    const user = req.user;
    let role = "usuario";
    if (user.email === "adminCoder@coder.com") {
      role = "admin";
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: role,
    };

    res.send({
      status: "success",
      message: "User logged in successfully",
      payload: req.session.user,
    });
  }
);

sessionRouter.get("/failLogin", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Wrong email or password",
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

sessionRouter.post("/resetPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", error: "Missing data" });
  }
  const result = await userModel.findOne({ email });

  if (!result) {
    return res.status(401).send({
      status: "error",
      error: "Wrong email",
    });
  }
  const hashedPassword = createHash(password);
  const updatedUser = await userModel.updateOne(
    { _id: result._id },
    { $set: { password: hashedPassword } }
  );
  res.send({
    status: "success",
    message: "User password updated successfully",
    details: updatedUser,
  });
});

module.exports = sessionRouter;