import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'techub';

// user registration
export const registrationUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({ success: false, error: 'Email already registered' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }

    const strongPassword = (password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_\-]/.test(password);
      const isLongEnough = password.length >= 8;
      return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
    };

    if (!strongPassword(password)) {
      return res.json({
        success: false,
        error: 'Password must contain:\n' +
          'At least 8 characters\n' +
          'One uppercase letter\n' +
          'One lowercase letter\n' +
          'One number\n' +
          'One special character (!@#$%^&*()_-)'
      });
    }

    // no hashing here — Sequelize will auto-hash
    const user = await User.create({
      first_name,
      last_name,
      email,
      password_hash: password, // raw password
    });

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.json({ success: false, message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      token
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid login' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'first_name', 'last_name', 'email'] // select only necessary fields
    });
    res.json(users); // send array of users as JSON
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email === process.env.ADMIN_EMAIL) {
      return res.json({ success: true, message: "Authorized" });
    }

    res.status(403).json({ success: false, message: "Forbidden" });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export default { registrationUser, loginUser, loginAdmin, verifyAdmin, getUsers };
