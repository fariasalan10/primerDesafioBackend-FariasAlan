const { Router } = require("express");
const sessionRouter = Router();
const passport = require("passport");
const SessionController = require("../controllers/session.controller");

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "api/sessions/failRegister",
  }),
  SessionController.register
);

sessionRouter.get("/failRegister", SessionController.failRegister);

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failLogin",
  }),
  SessionController.login
);

sessionRouter.get("/failLogin", SessionController.failLogin);

sessionRouter.get("/logout", SessionController.logout);

sessionRouter.post("/resetPassword", SessionController.resetPassword);

sessionRouter.get(
  "/changePassword/:passwordResetToken",
  SessionController.verifyToken
);

sessionRouter.post("/changePassword", SessionController.changePassword);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/failLogin" })
);

sessionRouter.get("/current", SessionController.current);

module.exports = sessionRouter;
