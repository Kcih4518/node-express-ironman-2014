const authServices = require("../services/authService.js");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Username received:", username);
    const user = await authServices.findUserByUsername(username);

    if (user && authServices.comparePassword(password, user.password)) {
      const token = authServices.generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/todos");
    } else {
      res.render("login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  const existingUser = await authServices.findUserByUsername(username);

  if (existingUser) {
    res.render("register", { error: "Username already taken" });
  } else {
    const user = await authServices.createUser(username, password, email);
    const token = authServices.generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/todos");
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = {
  login,
  register,
  logout,
};
