const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const ip = req.ip;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Tên người dùng đã tồn tại" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hash,
      email,
      registerIP: ip,
      lastLoginIP: ip,
    });

    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  console.log(req.body)
  console.log(user)


});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Sai tên đăng nhập" });
    if (user.isLocked) return res.status(403).json({ message: "Tài khoản đã bị khóa" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Sai mật khẩu" });

    // Nếu user đã có session đang hoạt động => chặn
    if (user.activeSession) return res.status(403).json({ message: "Tài khoản đã đăng nhập ở nơi khác" });

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    user.activeSession = token;
    user.lastLoginIP = ip;
    await user.save();

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  res.cookie("token", token, {
  httpOnly: true,
  secure: true, // nếu dùng HTTPS
  sameSite: "None"
});

// Đăng xuất
router.post("/logout", async (req, res) => {
  try {
    const { username } = req.body;
    await User.updateOne({ username }, { $unset: { activeSession: "" } });
    res.json({ message: "Đã đăng xuất" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
