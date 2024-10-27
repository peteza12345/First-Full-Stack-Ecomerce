const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email) return res.status(400).json({ message: 'Please provide an email' });
    if (!password) return res.status(400).json({ message: 'Please provide a password' });

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email
      };
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });
      const tokenOption = { httpOnly: true, secure: true, sameSite: 'None' };

      return res.cookie('token', token, tokenOption)
        .status(200).json({
          data: token,
          message: 'Login successfully',
          success: true,
          error: false
        });

    } else {
      return res.status(400).json({ message: 'Please check Password' });
    }

  } catch (err) {
    return res.status(500).json({ message: err.message || 'An error occurred', error: true, success: false });
  }
};

module.exports = userSignInController;