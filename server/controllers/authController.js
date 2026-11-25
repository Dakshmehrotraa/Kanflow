import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const AV = ['#6c5ce7', '#00b894', '#0984e3', '#e17055', '#e84393', '#fdcb6e', '#00cec9'];
const pickColor = (s) =>
  AV[[...(s || '?')].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length];

const shape = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatarColor: u.avatarColor,
});

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
      avatarColor: pickColor(email),
    });
    res.status(201).json({ ...shape(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// @desc   Authenticate a user and issue a JWT
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ ...shape(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// @desc   Get the currently authenticated user
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  res.json(shape(req.user));
};
