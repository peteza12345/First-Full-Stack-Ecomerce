const bcrypt = require('bcrypt');

const userModel = require('../models/userModel');

async function userSignUpController(req, res) {
  try {
    const { name, email, password, profilePic } = req.body;

    // Trim and validate input fields
    // name = name.trim();
    // email = email.trim().toLowerCase();
    // password = password.trim();

    // Validate input fields
    if (!name) return res.status(400).json({ message: 'Please provide a name' });
    if (!email) return res.status(400).json({ message: 'Please provide an email' });
    if (!password) return res.status(400).json({ message: 'Please provide a password' });

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object with hashed password
    const newUser = new userModel({
      name,
      email,
      role: "GENERAL",
      password: hashedPassword,
      profilePic
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    return res.status(201).json({
      data: savedUser,
      success: true,
      error: false,
      message: 'User created successfully'
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = userSignUpController;