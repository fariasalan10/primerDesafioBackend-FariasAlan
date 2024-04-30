const { Router } = require("express");
const router = Router();
const ViewsController = require("../controllers/views.controller");
const checkRole = require("../middlewares/checkRole.middleware");

const publicAcces = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
};

const privateAcces = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
};

router.get("/", privateAcces, ViewsController.getHome);

router.get("/realtimeproducts", ViewsController.getRealTimeProducts);

router.get("/chat", checkRole("user"), ViewsController.getChat);

router.get("/products", ViewsController.getProducts);

router.get("/carts/:id", ViewsController.getCart);

router.get("/register", publicAcces, ViewsController.getRegister);

router.get("/login", publicAcces, ViewsController.getLogin);

router.get("/resetPassword", publicAcces, ViewsController.getResetPassword);

module.exports = router;
