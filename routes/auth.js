const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const ip = req.ip;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hash,
      email,
      phone,
      registerIP: ip,
      lastLoginIP: ip,
    });

    await user.save();

    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi đăng ký" });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Sai tên đăng nhập" });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    if (user.activeSession) {
      return res.status(403).json({ message: "Tài khoản đã đăng nhập ở nơi khác" });
    }

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    user.activeSession = token;
    user.lastLoginIP = ip;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Đăng nhập thành công", token, user });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi đăng nhập" });
  }
});

// Đăng xuất
router.post("/logout", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Thiếu tên người dùng để đăng xuất" });
    }

    await User.updateOne({ username }, { $unset: { activeSession: "" } });
    res.json({ message: "Đã đăng xuất" });
  } catch (err) {
    console.error("Lỗi đăng xuất:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi đăng xuất" });
  }
});

module.exports = router;
