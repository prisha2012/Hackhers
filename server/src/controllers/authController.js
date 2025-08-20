const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const validateRegister = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

const validateLogin = [
  body('email').isEmail(),
  body('password').isString(),
];

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user);
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.status(201).json({ user: safeUser, token });
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.json({ user: safeUser, token });
}

module.exports = { validateRegister, validateLogin, register, login };


