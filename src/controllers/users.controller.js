const { usersService } = require("../repositories");

class UsersController {
  static async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      res.send(users);
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async changeRole(req, res) {
    const { userId } = req.params;
    try {
      const user = await usersService.getById(userId);
      if (!["user", "premium"].includes(user.role)) {
        throw new Error("Invalid role");
      }
      if (user.role === "user") {
        user.role = "premium";
      } else {
        user.role = "user";
      }
      await usersService.update(user._id.toString(), {
        $set: { role: user.role },
      });
      res.send({ status: "success", message: "User updated" });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadDocuments(req, res) {
    try {
      const { userId } = req.params;
      const result = await usersService.addDocument(userId, req.files);
      res.send({
        status: "success",
        message: "Document uploaded",
        payload: result,
      });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadProfilePicture(req, res) {
    try {
      const { userId } = req.params;
      const result = await usersService.uploadProfilePicture(userId, req.file);
      res.send({
        status: "success",
        message: "Document uploaded",
        payload: result,
      });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}

module.exports = UsersController;
