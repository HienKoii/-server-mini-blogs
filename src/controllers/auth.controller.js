const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo user mới
    const userId = await User.create({ username, email, password });
    const user = await User.findById(userId);

    res.status(201).json({
      message: "Đăng ký thành công",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await User.findByPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Lấy thông tin user (không bao gồm password)
    const userInfo = await User.findById(user.id);

    // Tạo token
    const token = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Đăng nhập thành công",
      user: userInfo,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.me = async (req, res) => {
  try {
    // Lấy thông tin user từ request (đã được xác thực bởi middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng",
    });
  }
};
