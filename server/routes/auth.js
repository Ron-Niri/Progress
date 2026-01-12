import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Set token in cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

// @route   POST api/auth/register
// @desc    Register user and send verification email
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const verificationCode = generateCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user = new User({ 
      username, 
      email, 
      password,
      verificationCode,
      verificationCodeExpires,
      isVerified: false
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Send verification email
    await sendEmail(email, 'verification', { code: verificationCode, username });

    res.json({ 
      msg: 'Registration successful. Please check your email for verification code.',
      email: email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/verify
// @desc    Verify email with code
// @access  Public
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: 'Invalid verification code' });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ msg: 'Verification code expired' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Send welcome email
    await sendEmail(email, 'welcome', { username: user.username });

    const payload = { user: { id: user.id } };
    // 30 day expiration for long-lived session
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      setTokenCookie(res, token);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, xp: user.xp, level: user.level, preferences: user.preferences }, msg: 'Email verified successfully' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/resend-code
// @desc    Resend verification code
// @access  Public
router.post('/resend-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }

    const verificationCode = generateCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendEmail(email, 'verification', { code: verificationCode, username: user.username });

    res.json({ msg: 'Verification code resent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { login: loginId, password } = req.body; // loginId can be email or username

  try {
    // Case-insensitive search for username or email
    let user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${loginId}$`, 'i') } },
        { username: { $regex: new RegExp(`^${loginId}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first', needsVerification: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    // 30 day expiration for long-lived session
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      setTokenCookie(res, token);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, xp: user.xp, level: user.level, preferences: user.preferences } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Send password reset code
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const resetCode = generateCode();
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    await sendEmail(email, 'passwordReset', { code: resetCode, username: user.username });

    res.json({ msg: 'Password reset code sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password with code
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ msg: 'Invalid reset code' });
    }

    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ msg: 'Reset code expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/logout
// @desc    Logout user & clear cookie
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logged out successfully' });
});

export default router;
