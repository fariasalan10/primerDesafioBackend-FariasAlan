const { usersService } = require("../repositories");

class UsersController {
  static async changeRole(req, res) {
    const userId = req.params.id;
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
}

module.exports = UsersController;
