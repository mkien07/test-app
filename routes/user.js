const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Khóa hoặc mở khóa tài khoản
router.post("/lock", async (req, res) => {
  const { username, lock } = req.body;
  await User.updateOne({ username }, { isLocked: lock });
  res.json({ message: lock ? "Đã khóa tài khoản" : "Đã mở khóa" });
});

// Trừ tiền
router.post("/deduct", async (req, res) => {
  const { username, amount } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
  if (user.money < amount) return res.status(400).json({ message: "Không đủ tiền" });

  user.money -= amount;
  await user.save();
  res.json({ message: `Đã trừ ${amount}đ`, money: user.money });
});

module.exports = router;
