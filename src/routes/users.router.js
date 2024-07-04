const { Router } = require("express");
const UsersController = require("../controllers/users.controller");
const upload = require("../middlewares/upload.middleware");
const checkRole = require("../middlewares/checkRole.middleware");
const router = Router();

//TODO: Colocar en get el middleware checkRole(["admin", "premium", "usuario"])
//TODO: Colocar en delete el middleware checkRole(["admin"])

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
router.delete("/", UsersController.deleteUnactive);
router.put("/:userId", UsersController.updateUser);
router.delete("/:userId", UsersController.deleteUser);

module.exports = {
  usersRouter: router,
};
