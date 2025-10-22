const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: String,
  money: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  registerIP: String,
  lastLoginIP: String,
  registerTime: { type: Date, default: Date.now },
  activeSession: String, // lưu token hiện tại
});

module.exports = mongoose.model("User", userSchema);
