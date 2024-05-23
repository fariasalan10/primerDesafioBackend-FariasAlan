const checkRole = (roles) => (req, res, next) => {
  const user = req.session.user;

  if (!roles.includes(user.role)) {
    return res
      .status(403)
      .send({
        status: "error",
        error: `Unauthorized. You need one of the following roles: ${roles.join(
          ", "
        )}`,
      });
  }

  next();
};

module.exports = checkRole;
