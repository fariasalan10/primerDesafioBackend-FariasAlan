const { Router } = require("express");
const sessionRouter = Router();
const userModel = require("../dao/models/users");
const passport = require("passport");
const { createHash } = require("../utils");

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "api/sessions/failRegister",
  }),
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
    if (user.email === "adminCoder@coder.com" && user.password === "admin123") {
      role = "admin";
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: role,
      id: user._id,
      cart: user.cart,
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

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/failLogin" }),
  async (req, res) => {
    req.session.user = {
      name: req.user.first_name,
      email: req.user.email,
      age: req.user.age,
      role: "usuario",
    };
    res.redirect("/");
  }
);

sessionRouter.get("/current", (req, res) => {
  if (req.session.user) {
    res.send({
      status: "success",
      user: req.session.user,
    });
  } else {
    res.send({
      status: "error",
      message: "User not found",
    });
  }
});

module.exports = sessionRouter;
