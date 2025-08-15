import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name,email and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), password: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered Successfully' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    if (!isValidEmail(email)) {
      return res.status(401).json({ message: 'Invalid email format.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid Password' });
    }


    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10d' });
  
    res.json({ message: "Login", token });

  } catch (err) {
    next(err);
  }
};