const { Router } = require("express");
const router = Router();

const MockController = require("../controllers/mock.controller");

router.get("/mockingProducts", MockController.getUsers);

module.exports = {
  mockRouter: router,
};
