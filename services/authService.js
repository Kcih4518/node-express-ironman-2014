const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { BadRequestError, UnauthorizedError } = require('../utils/customErrors');

const JWT_SECRET = process.env.JWT_SECRET;

const authService = {
  async loginUser(username, password) {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, token };
  },

  async registerUser(username, password, email) {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      throw new BadRequestError('Username already exists');
    }

    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      throw new BadRequestError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return { user, token };
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  },
};

module.exports = authService;
