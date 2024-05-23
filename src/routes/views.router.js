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

router.get("/", ViewsController.getHome);

router.get(
  "/realtimeproducts",
  checkRole("usuario"),
  ViewsController.getRealTimeProducts
);

router.get("/chat", checkRole("usuario"), ViewsController.getChat);

router.get("/products", ViewsController.getProducts);

router.get("/carts/:id", ViewsController.getCart);

router.get("/mockingproducts", ViewsController.mockProducts);

router.get("/register", ViewsController.getRegister);

router.get("/login", ViewsController.getLogin);

router.get("/resetPassword", ViewsController.getResetPassword);

router.get("/changePassword", ViewsController.getChangePassword);

module.exports = router;
