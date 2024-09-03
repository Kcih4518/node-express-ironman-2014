const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.redirect("/register");
      }
      req.user = user;
      next();
    });
  } else {
    console.log("Token not found, redirecting to register.");
    res.redirect("/register");
  }
};

module.exports = {
  authenticateJWT,
};
