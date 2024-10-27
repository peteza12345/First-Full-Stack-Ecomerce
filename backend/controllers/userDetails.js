const userModel = require('../models/userModel');

async function userDetailsController(req, res) {
  try {
    // console.log('User ID', req.user.id);
    const users = await userModel.findById(req.userId);
    // console.log('user', user);
    if (!users) {
      return res.status(200).json({
        data: [], 
        message: 'Do not have user', 
        success: true, 
        error: false 
      });
    }

    return res.status(200).json({
      data: users, 
      message: 'User details', 
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

module.exports = userDetailsController;