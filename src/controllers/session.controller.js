const { createHash, isValidPassword } = require("../utils");
const UserDTO = require("../dao/DTOs/UserDTO");
const CustomError = require("../utils/errorHandling/customError");
const ErrorTypes = require("../utils/errorHandling/errorTypes");
const MailingService = require("../services/mailing.service");
const jwt = require("jsonwebtoken");
const jwtSecret = "coderhouse";
const { usersService } = require("../repositories");

const mailingService = new MailingService();

class SessionController {
  static async register(req, res) {
    res.send({
      status: "success",
      message: "User created successfully",
    });
  }

  static async failRegister(req, res, next) {
    try {
      alert("User already exists");
      throw new CustomError({
        name: "User already exists",
        cause: "User already exists",
        message: "User already exists",
        code: ErrorTypes.INVALID_TYPE,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res) {
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

    await usersService.setLastConnection(user._id);

    res.send({
      status: "success",
      message: "User logged in successfully",
      payload: req.session.user,
    });
  }

  static async failLogin(req, res) {
    res.status(400).send({
      status: "error",
      message: "Wrong email or password",
    });
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Internal server error",
        });
      }
    });
    await usersService.setLastConnection(user._id);

    res.redirect("/login");
  }

  static async resetPassword(req, res) {
    try {
      const { email } = req.body;
      let user = await usersService.getByProperty("email", email);
      const passwordResetToken = jwt.sign(user, jwtSecret, { expiresIn: "1h" });

      await mailingService.sendPasswordResetMail(
        user,
        email,
        passwordResetToken
      );
      res.send({ payload: user });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async verifyToken(req, res) {
    const { passwordResetToken } = req.params;
    try {
      jwt.verify(passwordResetToken, jwtSecret, (error) => {
        if (error) {
          return res.redirect("/resetPassword");
        } else {
          return res.redirect("/changePassword");
        }
      });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { email, password } = req.body;
      let user = await usersService.getByProperty("email", email);
      if (isValidPassword(user, password)) {
        return res.status(400).send({
          status: "error",
          message: "Same password",
        });
      } else {
        user.password = password;
        await usersService.update(user._id.toString(), {
          $set: { password: createHash(user.password) },
        });
        res.send({ status: "success" });
      }
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async github(req, res) {}

  static async githubCallback(req, res) {
    req.session.user = {
      name: req.user.first_name,
      email: req.user.email,
      age: req.user.age,
      role: "usuario",
    };
    res.redirect("/");
  }

  static async current(req, res) {
    const user = req.session.user;
    const userDTO = new UserDTO(user);
    res.send({
      payload: userDTO,
    });
  }
}
module.exports = SessionController;
