const User = require('../model/user_model');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ email, password });
    const { password: _, ...data } = newUser.toJSON();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: '1h' }
    );
    return res.status(201).json({ message: 'User created', user: data, token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: _, ...data } = user.toJSON();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: '1h' }
    );
    return res.status(200).json({ message: 'Login successful', user: data, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
