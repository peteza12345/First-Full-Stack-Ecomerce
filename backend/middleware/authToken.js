const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;
    // ตรวจสอบว่ามีการส่ง token มาหรือไม่
    if (!token) {
      return res.status(401).json({ message: 'Please Login...!', success: false });
    }

    // ตรวจสอบความถูกต้องของ token
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      console.log(err)

      if (err) {
        console.log("error auth", err)
      }

      req.userId = decoded?._id

      next()
    });

  } catch (err) {
    // ตรวจสอบประเภทของข้อผิดพลาดที่เกิดขึ้น
    res.status(400).json({
      message: err.message || err,
      data: [],
      error: true,
      success: false
    })
  }
};

module.exports = authToken;