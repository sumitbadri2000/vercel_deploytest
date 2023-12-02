const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "ev4", (err, decoded) => {
      if (decoded) {
        req.body.user = decoded.userId;
        next();
      } else {
        res.send({ msg: "please login" });
      }
    });
  } else {
    res.send({ msg: "first login" });
  }
};

module.exports = { auth };
