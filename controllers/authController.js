const authService = require("../services/authService.js");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }

    const { user, token } = await authService.loginUser(username, password);

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/todos");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).render("login", { error: error.message });
    }
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      throw new BadRequestError("Username, password, and email are required");
    }

    const { user, token } = await authService.registerUser(
      username,
      password,
      email
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/todos");
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).render("register", { error: error.message });
    }
    next(error);
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
