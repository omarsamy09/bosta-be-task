const jwt = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Token not provided." });
  }

  jwt.verify(token, "verryyyysecretkey", (err, decodedToken) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid token." });
    }
    req.userId = decodedToken.userId;
    next();
  });
}
module.exports = {
  isAuthenticated,
};
