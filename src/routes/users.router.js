const { Router } = require("express");
const UsersController = require("../controllers/users.controller");
const upload = require("../middlewares/upload.middleware");
const router = Router();

router.get("/", UsersController.getAll);
router.get("/premium/:userId", UsersController.changeRole);
router.post(
  "/:userId/documents",
  upload.array("document"),
  UsersController.uploadDocuments
);
router.post(
  "/:userId/profile-picture",
  upload.single("picture"),
  UsersController.uploadProfilePicture
);

module.exports = {
  usersRouter: router,
};
