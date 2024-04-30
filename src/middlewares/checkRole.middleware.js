const checkRole = (role) => (req, res, next) => {
  const user = req.session.user;

  if (user.role != role) {
    return res
      .status(403)
      .send({ status: "error", error: `Unauthorized. You are not a ${role}` });
  }

  next();
};

module.exports = checkRole;
