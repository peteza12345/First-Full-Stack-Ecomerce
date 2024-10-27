async function userLogout(req, res) {
  try {
    // ลบ token จาก cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // เพื่อความปลอดภัยใน production
      sameSite: 'strict',
    });

    // ส่ง response เมื่อ logout สำเร็จ
    return res.status(200).json({
      message: "Logged out successfully",
      error: false,
      success: true,
      data: [],
    });
  } catch (err) {
    // ส่ง response เมื่อเกิดข้อผิดพลาด
    return res.status(500).json({
      message: err.message || "An error occurred while logging out",
      error: true,
      success: false,
    });
  }
}

//   try {
//     res.clearCookie('token'); // ใช้ clearCookie แทน clearCookies

//     return res.status(200).json({ 
//       message: 'Logged out successfully', 
//       error: false, 
//       success: true, 
//       data: [] 
//     });

//   } catch (err) {
//     return res.status(500).json({ 
//       message: err.message || 'An error occurred', 
//       error: true, 
//       success: false 
//     });
//   }
// }

module.exports = userLogout;