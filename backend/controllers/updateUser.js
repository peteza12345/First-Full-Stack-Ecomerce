const userModel = require('../models/userModel');

async function updateUser(req, res) {
  try {
    // req.user.id
    const sessionUser = req.userId;
    const { userId, name, email, role } = req.body;
    const payload = {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(role && { role: role })
    };

    const users = await userModel.findById(sessionUser);

    const updateUsers = await userModel.findByIdAndUpdate(userId, payload);

    return res.status(200).json({
      data: updateUsers,
      message: 'User Updated',
      error: false,
      success: true
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = updateUser;