const userModel = require("../models/userModel");

async function allUsers(req, res) {
  try {
    const allUser = await userModel.find();

    return res.status(200).json({
      message: 'All Users',
      data: allUser,
      success: true,
      error: false
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || 'An error occurred',
      error: true,
      success: false
    });
  }
}

module.exports = allUsers;